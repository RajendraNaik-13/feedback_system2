import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaThumbsUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FeedbackKanban = ({ 
  feedback, 
  onUpvote, 
  onRemoveUpvote, 
  onStatusChange,
  isAuthenticated 
}) => {
  const [columns, setColumns] = useState({
    new: {
      name: 'New',
      items: []
    },
    in_progress: {
      name: 'In Progress',
      items: []
    },
    under_review: {
      name: 'Under Review',
      items: []
    },
    implemented: {
      name: 'Implemented',
      items: []
    },
    closed: {
      name: 'Closed',
      items: []
    }
  });

  useEffect(() => {
    const newColumns = { ...columns };
    Object.keys(newColumns).forEach(key => {
      newColumns[key].items = [];
    });
    feedback.forEach(item => {
      if (newColumns[item.status]) {
        newColumns[item.status].items.push(item);
      } else {
        newColumns.new.items.push(item);
      }
    });
    setColumns(newColumns);
  }, [feedback]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (!isAuthenticated || source.droppableId === destination.droppableId) {
      return;
    }
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const item = sourceColumn.items[source.index];
    onStatusChange(item.id, destination.droppableId);
    const newSourceItems = [...sourceColumn.items];
    newSourceItems.splice(source.index, 1);
    const newDestItems = [...destColumn.items];
    newDestItems.splice(destination.index, 0, item);
    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: newSourceItems },
      [destination.droppableId]: { ...destColumn, items: newDestItems }
    });
  };

  const handleUpvoteClick = (feedbackId, isUpvoted) => {
    if (isUpvoted) {
      onRemoveUpvote(feedbackId);
    } else {
      onUpvote(feedbackId);
    }
  };

  const statusColors = {
    new: 'bg-blue-100 border-blue-300',
    in_progress: 'bg-yellow-100 border-yellow-300',
    under_review: 'bg-purple-100 border-purple-300',
    implemented: 'bg-green-100 border-green-300',
    closed: 'bg-gray-100 border-gray-300'
  };

  const priorityColors = {
    low: 'bg-gray-100',
    medium: 'bg-blue-100',
    high: 'bg-orange-100',
    critical: 'bg-red-100'
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-wrap md:flex-nowrap gap-4 overflow-x-auto pb-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="flex-1 min-w-64 bg-gray-50 rounded-lg shadow-sm">
            <div className={`p-2 font-semibold text-center rounded-t-lg ${statusColors[columnId]}`}>
              {column.name} ({column.items.length})
            </div>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`min-h-72 p-2 transition-colors ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
                >
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index} isDragDisabled={!isAuthenticated}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 mb-2 bg-white rounded border ${snapshot.isDragging ? 'shadow-md' : 'shadow-sm'} hover:shadow`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-sm line-clamp-2">
                              <Link to={`/boards/${item.board}/feedback/${item.id}`} className="hover:text-blue-600">
                                {item.title}
                              </Link>
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[item.priority]}`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">by {item.created_by.username}</span>
                            <button
                              onClick={() => handleUpvoteClick(item.id, item.is_upvoted)}
                              disabled={!isAuthenticated}
                              className={`flex items-center px-2 py-1 rounded ${
                                item.is_upvoted ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              <FaThumbsUp className="mr-1" />
                              {item.upvotes}
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default FeedbackKanban;
