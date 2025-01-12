import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";



export default function ExpenseForm() {

  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: '',
    category: '',
    date: new Date()
  });

  const [error, setError] = useState('');

  const [previusAmount, setPreviousAmount] = useState(0);

  const { dispatch, state, remainingBudget } = useBudget();

  useEffect( () => {
    if(state.editingId)
    {
      const editingExpense = state.expenses.filter( expenseEdit => expenseEdit.id === state.editingId)[0];

      setExpense(editingExpense);
      setPreviousAmount(editingExpense.amount);
    }
  }, [state.editingId])

  const handleChangeDate = (value: Value) => {
    setExpense({ ...expense, date: value });
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isAmountField = ['amount'].includes(name);

    setExpense({
      ...expense,
      [name]: isAmountField ? Number(value) : value
    });
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Valida que todos los campos esten llenos
    if(Object.values(expense).includes(''))
    {
      setError('Todos los campos son Requeridos');
      return;
    }

    // Valida que los gastos no superen el presupuesto
    if((expense.amount - previusAmount) > remainingBudget)
      {
        setError('El presupuesto ha sido exedido');
        return;
      }


    if(state.editingId)
    {
      dispatch({ type: 'update-expense', payload: { expense: {id: state.editingId, ...expense} } })
    }
    else
    {
      dispatch({ type: 'add-expense', payload: { expense } });
    }

    // reinicio del state
    setExpense({
      amount: 0,
      expenseName: '',
      category: '',
      date: new Date()
    });
  }


  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">{ state.editingId ? 'guardar cambios': 'nuevo gasto'}</legend>

      {error && <ErrorMessage>{ error }</ErrorMessage>}

      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">Nombre Gasto:</label>
        <input type="text" name="expenseName" id="expenseName" placeholder="Captura el Nombre del Gasto" className="bg-slate-100 p-2"
          value={expense.expenseName}
          onChange={handleChange} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">Cantidad:</label>
        <input type="text" name="amount" id="amount" placeholder="Captura la Cantidad del Gasto Ej. 200" className="bg-slate-100 p-2"
          value={expense.amount}
          onChange={handleChange} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">Categoría:</label>
        <select name="category" id="category" className="bg-slate-100 p-2" value={expense.category} onChange={handleChange}>
          <option value="">--- Seleccione ---</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">Fecha Gasto:</label>
        <DatePicker className="bg-slate-100 p-2 border-0" value={expense.date} onChange={handleChangeDate} />
      </div>

      <input type="submit" value={ state.editingId ? 'guardar cambios': 'nuevo gasto'}className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg" />
    </form>
  )
}
