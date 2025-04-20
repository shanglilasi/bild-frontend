
//components/DatensatzNavigation.tsx

type DatensatzNavigatorProps = {
    index: number
    total: number
    onPrev: () => void
    onNext: () => void
  }
  
  export default function DatensatzNavigator({
    index,
    total,
    onPrev,
    onNext,
  }: DatensatzNavigatorProps) {
    if (total === 0) return null
  
    return (
      <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded">
        <button
          onClick={onPrev}
          disabled={index <= 0}
          className={`px-3 py-1 rounded ${
            index <= 0 ? 'bg-gray-700 text-gray-500' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          ◀
        </button>
  
        <span className="text-sm">
          Treffer {index + 1} von {total}
        </span>
  
        <button
          onClick={onNext}
          disabled={index >= total - 1}
          className={`px-3 py-1 rounded ${
            index >= total - 1
              ? 'bg-gray-700 text-gray-500'
              : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          ▶
        </button>
      </div>
    )
  }