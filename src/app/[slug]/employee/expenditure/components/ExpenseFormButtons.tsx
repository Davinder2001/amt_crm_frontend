'use client';

interface ExpenseFormButtonsProps {
    expense?: Expense | null;
    onCancel?: () => void;
    resetForm: () => void;
}

export default function ExpenseFormButtons({
    expense,
    onCancel,
    resetForm
}: ExpenseFormButtonsProps) {
    return (
        <div className="form-group button-group">
            {onCancel && (
                <button
                    type="button"
                    className="cancel-btn buttons"
                    onClick={() => {
                        resetForm();
                        onCancel();
                    }}
                >
                    Cancel
                </button>
            )}
            <button type="submit" className="submit-btn">
                {expense ? 'Update Expense' : 'Add Expense'}
            </button>
        </div>
    );
} 