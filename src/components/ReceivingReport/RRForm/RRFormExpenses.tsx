import { useEffect, useState } from "react";
import { Sheet, Table, Select, Option, Input, Button } from "@mui/joy";
import type { DeliveryReceipt } from "../../../interface";
import type { Dispatch, SetStateAction } from "react";
import { v4 as uuid } from "uuid";

const RRFormExpenses = ({
  selectedSDRs,
  setTotalExpense,
}: {
  selectedSDRs: DeliveryReceipt[];
  setTotalExpense: Dispatch<SetStateAction<number>>;
}): JSX.Element => {
  const initialExpense = { id: uuid(), type: "", amount: 0, otherExpense: 0 };
  const [expenses, setExpenses] = useState([initialExpense]);

  useEffect(() => {
    const totalExpense = expenses.reduce(
      (acc, expense) => acc + expense.amount + expense.otherExpense,
      0,
    );
    setTotalExpense(totalExpense);
  }, [expenses]);

  const handleSelectChange = (id: any, value: string): void => {
    if (value !== null) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === id ? { ...expense, type: value } : expense,
        ),
      );
    }
  };

  const handleInputChange = (id: any, field: string, value: number): void => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, [field]: Number(value) } : expense,
      ),
    );
  };

  return (
    <Sheet
      sx={{
        "--TableCell-height": "40px",
        "--TableHeader-height": "calc(1 * var(--TableCell-height))",
        "--Table-firstColumnWidth": "150px",
        "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
        "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
        overflow: "auto",
        borderRadius: 8,
        marginTop: 3,
        background: (
          theme,
        ) => `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
              linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
              radial-gradient(farthest-side at 0 50%, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0)) 0 100%`,
        backgroundSize:
          "40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "local, local, scroll, scroll",
        backgroundPosition:
          "var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)",
        backgroundColor: "background.surface",
        maxHeight: "600px",
        width: "60%",
      }}
    >
      <Table
        className="h-5"
        sx={{
          "& tr > *:first-child": {
            position: "sticky",
            left: 0,
            boxShadow: "1px 0 var(--TableCell-borderColor)",
            bgcolor: "background.surface",
          },
          "& tr > *:last-child": {
            position: "sticky",
            right: 0,
            bgcolor: "var(--TableCell-headBackground)",
          },
        }}
        borderAxis="both"
      >
        <thead>
          <tr>
            <th style={{ width: "var(--Table-firstColumnWidth)" }}>Expense</th>
            <th style={{ width: 100 }}>Amount</th>
            <th style={{ width: 100 }}>Other Expenses</th>
            <th style={{ width: 65 }}></th>
          </tr>
        </thead>
        <tbody>
          {selectedSDRs.length > 0 &&
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td>
                  <Select
                    onChange={(event, value) => {
                      if (value !== null) handleSelectChange(expense.id, value);
                    }}
                    className="mt-1 border-0"
                    size="sm"
                    placeholder="Select Expense"
                    value={expense.type}
                    required
                  >
                    <Option value="brokerage">Brokerage</Option>
                    <Option value="freight">Freight</Option>
                  </Select>
                </td>
                <td>
                  <Input
                    type="number"
                    slotProps={{ input: { min: 0 } }}
                    onChange={(event) =>
                      handleInputChange(
                        expense.id,
                        "amount",
                        Number(event.target.value),
                      )
                    }
                    value={expense.amount}
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    slotProps={{ input: { min: 0 } }}
                    onChange={(event) =>
                      handleInputChange(
                        expense.id,
                        "otherExpense",
                        Number(event.target.value),
                      )
                    }
                    value={expense.otherExpense}
                  />
                </td>
                <td>
                  <div className="flex justify-center">
                    <Button
                      size="sm"
                      variant="soft"
                      color="danger"
                      className="bg-delete-red"
                      onClick={() =>
                        setExpenses(expenses.filter((e) => e.id !== expense.id))
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {selectedSDRs.length > 0 && (
        <Button
          size="sm"
          color="primary"
          className="bg-button-primary mt-4"
          onClick={() =>
            setExpenses([
              ...expenses,
              { id: uuid(), type: "", amount: 0, otherExpense: 0 },
            ])
          }
        >
          Add Expense
        </Button>
      )}
    </Sheet>
  );
};

export default RRFormExpenses;
