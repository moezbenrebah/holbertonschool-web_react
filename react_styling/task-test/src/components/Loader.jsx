export default function Loader() {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded-full bg-red-500 animate-bounce"></div>
          <div className="h-4 w-4 rounded-full bg-red-500 animate-bounce delay-150"></div>
          <div className="h-4 w-4 rounded-full bg-red-500 animate-bounce delay-300"></div>
        </div>
      </div>
    );
  }
  