import React, { useState } from 'react';

const Messages = () => {
    // Mock data for UI demonstration
    const [chats] = useState([
        { id: 1, name: 'HR Team', message: 'Remember to submit the weekly report.', time: '10:30 AM', unread: 2 },
        { id: 2, name: 'John Doe', message: 'Can we reschedule our meeting?', time: 'Yesterday', unread: 0 },
        { id: 3, name: 'System', message: 'Your password expires in 3 days.', time: '2 days ago', unread: 0 }
    ]);
    const [selectedChat, setSelectedChat] = useState(chats[0]);

    return (
        <div className="h-[calc(100vh-100px)] p-6 flex gap-6 max-w-7xl mx-auto">
            {/* Sidebar List */}
            <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="font-bold text-slate-800">Inbox</h2>
                    <input type="text" placeholder="Search messages..." className="mt-3 w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedChat.id === chat.id ? 'bg-emerald-50 border-emerald-100' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-semibold ${selectedChat.id === chat.id ? 'text-emerald-800' : 'text-slate-800'}`}>{chat.name}</span>
                                <span className="text-xs text-slate-400">{chat.time}</span>
                            </div>
                            <p className="text-sm text-slate-500 line-clamp-1">{chat.message}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold">
                            {selectedChat.name[0]}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{selectedChat.name}</h3>
                            <span className="text-xs text-emerald-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-6 bg-slate-50/30 overflow-y-auto">
                    <div className="text-center text-xs text-slate-400 mb-6">- Today -</div>
                    <div className="flex gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm max-w-[80%]">
                            <p className="text-sm text-slate-700">{selectedChat.message}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-4 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex-shrink-0"></div>
                        <div className="bg-emerald-600 p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                            <p className="text-sm text-white">Sure, I'll take a look at it right away.</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-white">
                    <div className="flex gap-2">
                        <input type="text" placeholder="Type your message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-200">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
