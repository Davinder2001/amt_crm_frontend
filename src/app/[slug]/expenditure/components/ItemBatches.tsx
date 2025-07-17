'use client';

import { useFetchItemBatchByIdQuery } from '@/slices';

interface ItemBatchesProps {
    itemId: number;
    selectedBatches: Array<{ itemId: number; batchIds: number[] }>;
    handleBatchSelection: (itemId: number, batchId: number) => void;
    handleSelectAllBatches: (itemId: number, allBatchIds: number[]) => void;
}

export default function ItemBatches({
    itemId,
    selectedBatches,
    handleBatchSelection,
    handleSelectAllBatches
}: ItemBatchesProps) {
    const { data: batchesData, isLoading, isError } = useFetchItemBatchByIdQuery(itemId);
    const selectedBatchIds = selectedBatches.find(b => b.itemId === itemId)?.batchIds || [];
    const allBatchIds = (batchesData?.batch?.variants?.map(v => v.id).filter((id): id is number => id !== undefined)) || [];

    if (isLoading) return <div className="loading-batches">Loading batches...</div>;
    if (isError) return <div className="error-batches">Error loading batches</div>;
    if (!batchesData?.batch?.variants?.length) return <div className="no-batches">No batches available</div>;

    return (
        <div className="batch-options">
            <div className="select-all-batches">
                <input
                    type="checkbox"
                    id={`select-all-${itemId}`}
                    checked={selectedBatchIds.length === allBatchIds.length && allBatchIds.length > 0}
                    onChange={() => handleSelectAllBatches(itemId, allBatchIds)}
                />
                <label htmlFor={`select-all-${itemId}`}>Select All</label>
            </div>
            {batchesData.batch.variants
                .filter((b): b is typeof b & { id: number } => b.id !== undefined)
                .map((batch) => (
                    <div key={batch.id} className="batch-option">
                        <input
                            type="checkbox"
                            id={`batch-${itemId}-${batch.id}`}
                            checked={selectedBatchIds.includes(batch.id)}
                            onChange={() => handleBatchSelection(itemId, batch.id)}
                        />
                        <label htmlFor={`batch-${itemId}-${batch.id}`}>
                            Purchased: {batchesData.batch.purchase_date || 'N/A'}
                        </label>
                    </div>
                ))}
        </div>
    );
} 