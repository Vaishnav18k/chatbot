// 'use client';

// import { ToolInvocation } from 'ai';
// import { useChat } from '@ai-sdk/react';

// export default function Chat() {
//   const { messages, input, handleInputChange, handleSubmit, addToolResult } =
//     useChat({
//       maxSteps: 5,

//       // run client-side tools that are automatically executed:
//       async onToolCall({ toolCall }) {
//         if (toolCall.toolName === 'getLocation') {
//           const cities = [
//             'New York',
//             'Los Angeles',
//             'Chicago',
//             'San Francisco',
//           ];
//           return cities[Math.floor(Math.random() * cities.length)];
//         }
//       },
//     });

//   return (
//     <>

//     <div className=' min-h-screen '> 
//       <div className='flex flex-col-1 mt-10'> 
//       <div className='bg-slate-300   p-20 border border-bg-slate-300  '>
//       {messages?.map(message => (
//         <div key={message.id}>
//           <strong>{`${message.role}: `}</strong>
//           {message.parts.map(part => {
//             switch (part.type) {
//               // render text parts as simple text:
//               case 'text':
//                 return part.text;

//               // for tool invocations, distinguish between the tools and the state:
//               case 'tool-invocation': {
//                 const callId = part.toolInvocation.toolCallId;

//                 switch (part.toolInvocation.toolName) {
//                   case 'askForConfirmation': {
//                     switch (part.toolInvocation.state) {
//                       case 'call':
//                         return (
//                           <div key={callId}>
//                             {part.toolInvocation.args.message}
//                             <div>
//                               <button className='bg-green'
//                                 onClick={() =>
//                                   addToolResult({
//                                     toolCallId: callId,
//                                     result: 'Yes, confirmed.',
//                                   })
//                                 }
//                               >
//                                 Yes
//                               </button>
//                               <button className='bg-red '
//                                 onClick={() =>
//                                   addToolResult({
//                                     toolCallId: callId,
//                                     result: 'No, denied',
//                                   })
//                                 }
//                               >
//                                 No
//                               </button>
//                             </div>
//                           </div>
//                         );
//                       case 'result':
//                         return (
//                           <div key={callId}>
//                             Location access allowed:{' '}
//                             {part.toolInvocation.result}
//                           </div>
//                         );
//                     }
//                     break;
//                   }

//                   case 'getLocation': {
//                     switch (part.toolInvocation.state) {
//                       case 'call':
//                         return <div key={callId}>Getting location...</div>;
//                       case 'result':
//                         return (
//                           <div key={callId}>
//                             Location: {part.toolInvocation.result}
//                           </div>
//                         );
//                     }
//                     break;
//                   }

//                   case 'getWeatherInformation': {
//                     switch (part.toolInvocation.state) {
//                       // example of pre-rendering streaming tool calls:
//                       case 'partial-call':
//                         return (
//                           <pre key={callId}>
//                             {JSON.stringify(part.toolInvocation, null, 2)}
//                           </pre>
//                         );
//                       case 'call':
//                         return (
//                           <div key={callId}>
//                             Getting weather information for{' '}
//                             {part.toolInvocation.args.city}...
//                           </div>
//                         );
//                       case 'result':
//                         return (
//                           <div key={callId}>
//                             Weather in {part.toolInvocation.args.city}:{' '}
//                             {part.toolInvocation.result}
//                           </div>
//                         );
//                     }
//                     break;
//                   }
//                 }
//               }
//             }
//           })}
//           <br />
//         </div>
//       ))}

//       <form className='bg-green' onSubmit={handleSubmit}>
//         <input className='bg-blue-400' value={input} onChange={handleInputChange} />
//       </form>
//       </div>
//       </div>
//       </div>
//     </>
//   );
// }


// 'use client';

// import { ToolInvocation } from 'ai';
// import { useChat } from '@ai-sdk/react';
// import { useRouter } from 'next/navigation';

// export default function Chat() {
// const router = useRouter();
//   const { messages, input, handleInputChange, handleSubmit, addToolResult } =
//     useChat({
//       maxSteps: 5,
//       async onToolCall({ toolCall }) {
//         if (toolCall.toolName === 'getLocation') {
//           const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];
//           return cities[Math.floor(Math.random() * cities.length)];
//         }
//       },
//     });

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
// <div>
//     <button className='flex justify-end items-end bg-blue-500 text-white border border-white p-2 rounded-md' onClick={()=>router.push('/weather')}>Weather</button>
// </div>
//       {/* Chat messages area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages?.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div
//               className={`max-w-xs px-4 py-2 rounded-lg shadow ${
//                 message.role === 'user'
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-white text-gray-900 border'
//               }`}
//             >
//               {message.parts.map((part, index) => {
//                 switch (part.type) {
                  
//                   // line boundary between steps
//                   case 'step-start':
//                     // show step boundaries as horizontal lines:
//                     return index > 0 ? (
//                       <div key={index} className="text-gray-500">
//                         <hr className="my-2 border-gray-300" />
//                       </div>
//                     ) : null;


//                   case 'text':
//                     return <span key={index}>{part.text}</span>;

//                   case 'tool-invocation': {
//                     const callId = part.toolInvocation.toolCallId;
//                     switch (part.toolInvocation.toolName) {
//                       case 'askForConfirmation':
//                         switch (part.toolInvocation.state) {
//                           case 'call':
//                             return (
//                               <div key={callId}>
//                                 <p className="mb-2">{part.toolInvocation.args.message}</p>
//                                 <div className="flex gap-2">
//                                   <button
//                                     className="px-3 py-1 bg-green-500 text-white rounded"
//                                     onClick={() =>
//                                       addToolResult({
//                                         toolCallId: callId,
//                                         result: 'Yes, confirmed.',
//                                       })
//                                     }
//                                   >
//                                     Yes
//                                   </button>
//                                   <button
//                                     className="px-3 py-1 bg-red-500 text-white rounded"
//                                     onClick={() =>
//                                       addToolResult({
//                                         toolCallId: callId,
//                                         result: 'No, denied',
//                                       })
//                                     }
//                                   >
//                                     No
//                                   </button>
//                                 </div>
//                               </div>
//                             );
//                           case 'result':
//                             return (
//                               <div key={callId}>
//                                 Location access allowed: {part.toolInvocation.result}
//                               </div>
//                             );
//                         }
//                         break;

//                       case 'getLocation':
//                         switch (part.toolInvocation.state) {
//                           case 'call':
//                             return <div key={callId}>Getting location...</div>;
//                           case 'result':
//                             return (
//                               <div key={callId}>
//                                 Location: {part.toolInvocation.result}
//                               </div>
//                             );
//                         }
//                         break;

//                       case 'getWeatherInformation':
//                         switch (part.toolInvocation.state) {
//                           case 'partial-call':
//                             return (
//                               <pre key={callId} className="text-xs">
//                                 {JSON.stringify(part.toolInvocation, null, 2)}
//                               </pre>
//                             );
//                           case 'call':
//                             return (
//                               <div key={callId}>
//                                 Getting weather information for {part.toolInvocation.args.city}...
//                               </div>
//                             );
//                           case 'result':
//                             return (
//                               <div key={callId}>
//                                 Weather in {part.toolInvocation.args.city}: {part.toolInvocation.result}
//                               </div>
//                             );
//                         }
//                         break;
//                     }
//                   }

//                   default:
//                     return null;
//                 }
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Input form */}
//       <form onSubmit={handleSubmit} className="flex p-4 border-t bg-white">
//         <input
//           type="text"
//           value={input}
//           onChange={handleInputChange}
//           className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Type a message..."
//         />
//         <button
//           type="submit"
//           className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }



'use client';

import { ToolInvocation } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useRouter } from 'next/navigation';

export default function Chat() {
  const router = useRouter();
  const { messages, input, handleInputChange, handleSubmit, addToolResult } = useChat({
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'getLocation') {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];
        return cities[Math.floor(Math.random() * cities.length)];
      }
    },
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Chatbot</h1>
        <button
          onClick={() => router.push('/weather')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Weather
        </button>
      </header>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } mb-3`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              } `}
            >
              {message.parts.map((part, index) => {
                switch (part.type) {
                  case 'step-start':
                    return index > 0 ? (
                      <div key={index} className="text-gray-300 my-2">
                        <hr className="border-gray-200" />
                      </div>
                    ) : null;

                  case 'text':
                    return (
                      <span key={index} className="block text-sm">
                        {part.text}
                      </span>
                    );

                  case 'tool-invocation': {
                    const callId = part.toolInvocation.toolCallId;
                    switch (part.toolInvocation.toolName) {
                      case 'askForConfirmation':
                        switch (part.toolInvocation.state) {
                          case 'call':
                            return (
                              <div key={callId} className="space-y-2">
                                <p className="text-sm">{part.toolInvocation.args.message}</p>
                                <div className="flex gap-2">
                                  <button
                                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs"
                                    onClick={() =>
                                      addToolResult({
                                        toolCallId: callId,
                                        result: 'Yes, confirmed.',
                                      })
                                    }
                                  >
                                    Yes
                                  </button>
                                  <button
                                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                                    onClick={() =>
                                      addToolResult({
                                        toolCallId: callId,
                                        result: 'No, denied',
                                      })
                                    }
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            );
                          case 'result':
                            return (
                              <div key={callId} className="text-sm">
                                Location access: {part.toolInvocation.result}
                              </div>
                            );
                        }
                        break;

                      case 'getLocation':
                        switch (part.toolInvocation.state) {
                          case 'call':
                            return (
                              <div key={callId} className="text-sm text-gray-500 italic">
                                Getting location...
                              </div>
                            );
                          case 'result':
                            return (
                              <div key={callId} className="text-sm">
                                Location: {part.toolInvocation.result}
                              </div>
                            );
                        }
                        break;

                      case 'getWeatherInformation':
                        switch (part.toolInvocation.state) {
                          case 'partial-call':
                            return (
                              <pre key={callId} className="text-xs bg-gray-100 p-2 rounded">
                                {JSON.stringify(part.toolInvocation, null, 2)}
                              </pre>
                            );
                          case 'call':
                            return (
                              <div key={callId} className="text-sm text-gray-500 italic">
                                Getting weather for {part.toolInvocation.args.city}...
                              </div>
                            );
                          case 'result':
                            return (
                              <div key={callId} className="text-sm">
                                Weather in {part.toolInvocation.args.city}: {part.toolInvocation.result}
                              </div>
                            );
                        }
                        break;
                    }
                  }

                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t shadow-sm max-w-3xl mx-auto w-full"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

