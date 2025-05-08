'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import {
  useViewTaskTimelineQuery,
  useEndTaskMutation
} from '@/slices/tasks/taskApi'

const ViewPage = () => {
  const params = useParams()
  const id = params?.id as string

  const { data, isLoading, error, refetch } = useViewTaskTimelineQuery(id)
  const [endTask, { isLoading: isEnding }] = useEndTaskMutation()

  const handleEndTask = async () => {
    try {
      await endTask(Number(id)).unwrap()
      alert('Task marked as ended!')
      refetch()
    } catch (err) {
      alert('Error ending task')
      console.error(err)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading task timeline</div>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Task Timeline for ID: {id}</h1>

      {data.histories.length === 0 ? (
        <p>No history entries found.</p>
      ) : (
        <ul className="space-y-4">
          {data.histories.map((history: any) => (
            <li key={history.id} className="border p-4 rounded shadow-sm">
              <p><strong>Status:</strong> {history.status}</p>
              <p><strong>Description:</strong> {history.description}</p>
              <p><strong>Submitted At:</strong> {new Date(history.created_at).toLocaleString()}</p>

              {history.attachments?.length > 0 && (
                <div className="mt-2">
                  <strong>Attachments:</strong>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {history.attachments.map((url: string, index: number) => (
                      <Image
                        key={index}
                        src={url}
                        alt={`Attachment ${index + 1}`}
                        width={200}
                        height={200}
                        className="object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <button
          onClick={handleEndTask}
          disabled={isEnding}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isEnding ? 'Ending Task...' : 'End Task'}
        </button>
      </div>
    </div>
  )
}

export default ViewPage
