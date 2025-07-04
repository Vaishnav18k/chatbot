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

// export default function Chat() {
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


// 'use client';

// import { useChat } from '@ai-sdk/react';
// import { Weather } from './components/weather';
// // import { UIMessage as BaseUIMessage } from 'ai';
// export default function Page() {
//   const { messages, input, handleInputChange, handleSubmit } = useChat();

 

  
//   return (
//     <div className='min-h-screen '>
//       <div className='rounded-md w-md h-md  p-6  bg-gray-100 mt-50'>
//       {messages.map(message => (
//         <div key={message.id}>
//           <div className='font-bold'>{message.role === 'user' ? 'User: ' : 'AI: '}</div>
//           <div className='font-normal border border-slate-400 p-2  rounded-md'>{message.content}</div>
          
         
     
//         </div>






//       ))}
  




//       <form className='flex justify-start gap-2 py-4' onSubmit={handleSubmit}>
//         <input className='  bg-slate-300 text-black border border-white p-2 rounded-md' 
//           value={input}
//           onChange={handleInputChange}
//           placeholder="Type a message..."
//         />
//         <button className=' bg-blue-500 text-white border border-white p-2 rounded-md' type="submit">Send</button>
//       </form>
//       </div>
//     </div>
//   );
// }


'use client';

import { useChat } from '@ai-sdk/react';
import { Weather } from   './components/weather'

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className=' min-h-screen '> 
      <div className='flex flex-col-1 mt-10'> 
      <div className='bg-slate-300   p-20 border border-bg-slate-300  '>
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div>{message.content}</div>

          <div>
            {message.toolInvocations?.map(toolInvocation => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === 'result') {
                if (toolName === 'displayWeather') {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId}>
                      <Weather {...result} />
                    </div>
                  );
                }
              } else {
                return (
                  <div key={toolCallId}>
                    {toolName === 'displayWeather' ? (
                      <div>Loading weather...</div>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input className='border border-slate-300 bg-slate-300 text-black p-2 rounded-md'
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button  className='border border-slate-300 bg-blue-500 text-white p-2 rounded-md' type="submit">Send</button>
      </form>
    </div>
    </div>
    </div>
    </div>
  );
}