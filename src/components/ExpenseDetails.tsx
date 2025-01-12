import { useMemo } from "react";
import { formatDate } from "../helpers";
import { Expense } from "../types"
import AmountDisplay from "./AmountDisplay";
import { categories } from "../data/categories";
import { LeadingActions, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { useBudget } from "../hooks/useBudget";

type ExpenseDetailsProps = {
    expense: Expense;
}

export default function ExpenseDetails({ expense }: ExpenseDetailsProps) {

    const { dispatch } = useBudget();
    
    const categoryInfo = useMemo( () => categories.filter(cat => cat.id === expense.category)[0],[expense]);

    const leadingActions = () => (
        <LeadingActions>
            <SwipeAction onClick={() => dispatch({ type: 'get-expense-by-id', payload: { id: expense.id} })} >Actualizar</SwipeAction>
        </LeadingActions>
    );

    const trailingActions = () => (
        <TrailingActions >
            <SwipeAction onClick={() => dispatch({ type: 'remove-expense', payload: {id : expense.id} })}>Eliminar</SwipeAction>
        </TrailingActions>
    )
 
    return (
        <SwipeableList threshold={0.2} >
            <SwipeableListItem maxSwipe={0.25} leadingActions={ leadingActions() } trailingActions={ trailingActions() } >
                <div className="bg-white shadow-lg p-5 w-full border-b border-gray-200 flex gap-5 items-center">

                    <div>
                        <img src={`/icono_${categoryInfo.icon}.svg`} alt="Icono Gasto" className="w-20" />
                    </div>

                    <div className="flex-1 space-y-2">
                        <p className="text-sm font-bold uppercase text-slate-500">{ categoryInfo.name }</p>
                        <p>{ expense.expenseName }</p>
                        <p className="text-slate-600 text-sm">{ formatDate(expense.date!.toString()) }</p>
                    </div>

                    <AmountDisplay amount={expense.amount}/>

                </div>
            </SwipeableListItem>
        </SwipeableList>
        
    )
}
