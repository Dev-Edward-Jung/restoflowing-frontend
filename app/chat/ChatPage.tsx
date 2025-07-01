'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { connectWebSocket, disconnectWebSocket, sendMessage } from 'lib/websocket';
import Image from 'next/image';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';



interface ChatRequest {
    roomId: string;
    senderId: string;
    message: string;
    timestamp?: string; // 선택적: 클라이언트에서 보낼 수도 있음
}

interface ChatResponse {
    roomId: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: string;
    type: 'CHAT' | 'JOIN' | 'LEAVE'; // JOIN/LEAVE 이벤트 지원
}

export interface ChatParticipantsDto {
    id: number;
    name: string;
    role: 'OWNER' | 'EMPLOYEE' | 'KITCHEN' | 'MANAGER'; // 또는 string, enum 등 백엔드 구조에 맞게
}

export interface ChatRoomDto {
    id: number;
    name: string;
    lastMessage: string;
    chatParticipants: ChatParticipantsDto[];
    hours: string;
}


interface Employee {
    id: number;
    name: string;
    initial: string;
    lastMessage: string;
    role: string;
}

export default function ChattingPage() {

    const router = useRouter();
    const params = useSearchParams();
    const [jwt, setJwt] = useState<string | null>(null);

    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [isRightSidbarOpen, setRightSidebarOpen] = useState(false);
    const { memberId, memberRole } = useUser();
    const [chatRooms, setChatRooms] = useState<ChatRoomDto[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [activeId, setActiveId] = useState<number | null>(null);

    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const stompRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<StompSubscription | null>(null); // 👈 구독 객체 저장용



    const restaurantId = params.get('restaurantId');

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            router.push('/auth/owner/login');
            return;
        }
        setJwt(token);
    }, [router]);

    useEffect(() => {
        if (!restaurantId || !jwt) return;

        const fetchChatRoom = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/list?restaurantId=${restaurantId}`, {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to load employees');
                }

                const jsonData = await res.json();
                const data = jsonData.data
                console.log(data)


            } catch (err) {
                alert('Failed to fetch employees.');
                console.error(err);
            }
        };




        const fetchEmployees = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/employee/list?restaurantId=${restaurantId}`, {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to load employees');
                }

                const jsonData = await res.json();
                const data = jsonData.data;

                // Employee 타입에 맞게 가공
                const processedEmployees: Employee[] = data.map((item: any) => {
                    const match = item.name?.trim().match(/[a-zA-Z가-힣]/g);
                    const initial = match && match.length > 0 ? match[0].toUpperCase() : '';

                    return {
                        id: item.id,
                        name: item.name,
                        initial,
                        lastMessage: item.lastMessage ?? '', // 혹시 undefined 방지
                        role: item.role
                    };
                });

                setEmployees(processedEmployees); // ✅ 여기에 바로 저장

            } catch (err) {
                alert('Failed to fetch contacts');
                console.error(err);
            }
        };

        fetchChatRoom();
        fetchEmployees();

    }, [restaurantId, jwt]);



    // 1. 최초 WebSocket 연결 (mount 시)
        useEffect(() => {
            if (!jwt) return;
        
            // API URL이 http 또는 https일 수 있으므로 ws 또는 wss로 바꿔줌
            const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const wsURL = apiURL.replace(/^http/, 'ws') + '/api/ws/chat';
        
            const client = new Client({
              brokerURL: wsURL,
              connectHeaders: {
                Authorization: `Bearer ${jwt}`,
              },
              onConnect: () => {
                console.log('✅ STOMP 연결 성공');
              },
              onStompError: (frame) => {
                console.error('❌ STOMP 에러 발생:', frame.headers['message']);
                console.error('상세 내용:', frame.body);
              },
              debug: (msg) => console.log('[STOMP]', msg),
              reconnectDelay: 5000, // 재연결 시도 간격
            });
        
            client.activate();
        
            return () => {
              client.deactivate();
            };
          }, [jwt, restaurantId]);



    // ✅ 클릭 시 WebSocket 구독 및 메시지 로딩

    const handleEmployeeClick = async (employee: Employee) => {
        setActiveId(employee.id);
        const roomId = `room-${employee.id}`;

        // 1. 이전 구독 해제
        subscriptionRef.current?.unsubscribe(); // 👈 올바른 방식

        // 2. 메시지 불러오기 (옵션)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/room/${roomId}/messages`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        // const json = await res.json();
        // setMessages(json.data);

        // 3. 새 구독 시작
        // const newSubscription = stompRef.current?.subscribe(
        //   `/topic/chat/room/${roomId}`,
        //   message => {
        //     const msg = JSON.parse(message.body);
        //     setMessages(prev => [...prev, msg]);
        //   }
        // );

        // subscriptionRef.current = newSubscription ?? null; // 저장
    };



    return (
        <div>
            {/* // <!-- Content --> */}
            <div className="container-xxl flex-grow-1 container-p-y chat-wrapper">

                <div className="app-chat card overflow-hidden">
                    <div className="row g-0">
                        {isLeftSidebarOpen && (
                            <div
                                className="content-backdrop fade show"
                                onClick={() => setLeftSidebarOpen(false)}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    zIndex: 1040,
                                }}
                            />
                        )}
                        <div
                            className={`col app-chat-contacts app-sidebar flex-grow-0 border-end 
                                ${isLeftSidebarOpen ? 'show' : 'overflow-hidden'
                                }`}
                            id="app-chat-contacts"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sidebar-header p-2 px-6 border-bottom d-flex align-items-center">
                                <div className="d-flex align-items-center me-6 me-lg-0">
                                    <div className="flex-shrink-0 avatar avatar-online me-4" data-bs-toggle="sidebar" data-overlay="app-overlay-ex" data-target="#app-chat-sidebar-left">
                                        <Image className="user-avatar rounded-circle cursor-pointer" src="/img/avatars/1.png" alt="Avatar" width={60} height={60} />
                                    </div>
                                    <div className="flex-grow-1 input-group input-group-merge rounded-pill">
                                        <span className="input-group-text" id="basic-addon-search31"><i className="icon-base bx bx-search icon-sm"></i></span>
                                        <input type="text" className="form-control chat-search-input" placeholder="Search..." aria-label="Search..." aria-describedby="basic-addon-search31" />
                                    </div>
                                </div>
                                <i className="icon-base bx bx-x icon-lg cursor-pointer position-absolute top-50 end-0 translate-middle d-lg-none d-block" data-overlay="" data-bs-toggle="sidebar" data-target="#app-chat-contacts"></i>
                            </div>
                            <div className="sidebar-body ps ps--active-y">
                                {/* <!-- Chats --> */}
                                <ul className="list-unstyled chat-contact-list py-2 mb-0" id="chat-list">
                                    <li className="chat-contact-list-item chat-contact-list-item-title mt-0">
                                        <h5 className="text-primary mb-0">Chats</h5>
                                    </li>
                                    <li className="chat-contact-list-item chat-list-item-0 d-none">
                                        <h6 className="text-body-secondary mb-0">No Chats Found</h6>
                                    </li>





                                    <li className="chat-contact-list-item mb-0 chat-active">
                                        <a className="d-flex align-items-center">
                                            <div className="flex-shrink-0 avatar avatar-busy">
                                                <span className="avatar-initial rounded-circle bg-label-success">CM</span>
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h6 className="chat-contact-name text-truncate fw-normal m-0">Calvin Moore</h6>
                                                    <small className="chat-contact-list-item-time">1 Day</small>
                                                </div>
                                                <small className="chat-contact-status text-truncate">If it takes long you can mail inbox user</small>
                                            </div>
                                        </a>
                                    </li>


                                </ul>
                                {/* <!-- Contacts --> */}
                                <ul className="list-unstyled chat-contact-list mb-0 py-2" id="contact-list">
                                    <li className="chat-contact-list-item chat-contact-list-item-title mt-0">
                                        <h5 className="text-primary mb-0">Contacts</h5>
                                    </li>
                                    <li className="chat-contact-list-item contact-list-item-0 d-none">
                                        <h6 className="text-body-secondary mb-0">No Contacts Found</h6>
                                    </li>

                                    {employees.map((emp) => (
                                        <li
                                            key={emp.id}
                                            onClick={() => handleEmployeeClick(emp)}
                                            className={`chat-contact-list-item ${emp.id === activeId ? 'chat-active' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div className="avatar d-block flex-shrink-0">
                                                    <span className="avatar-initial rounded-circle bg-label-primary">{emp.initial}</span>
                                                </div>
                                                <div className="chat-contact-info flex-grow-1 ms-4">
                                                    <h6 className="chat-contact-name text-truncate m-0 fw-normal">{emp.name}</h6>
                                                    <small className="chat-contact-status text-truncate">{emp.role}</small>
                                                </div>
                                            </div>
                                        </li>
                                    ))}


                                </ul>
                                <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}><div className="ps__thumb-x" tabIndex={0} style={{ left: 0, bottom: 0 }}>
                                </div>
                                </div>

                            </div>
                        </div>
                        {/* <!-- /Chat contacts --> */}






                        {/* <!-- Chat conversation --> */}
                        <div className="col app-chat-conversation d-none align-items-center justify-content-center flex-column" id="app-chat-conversation">
                            <div className="bg-label-primary p-8 rounded-circle">
                                <i className="icon-base bx bx-message-alt-detail icon-48px"></i>
                            </div>
                            <p className="my-4">Select a contact to start a conversation.</p>
                            <button className="btn btn-primary app-chat-conversation-btn" id="app-chat-conversation-btn">Select Contact</button>
                        </div>
                        {/* <!-- /Chat conversation --> */}

                        {/* <!-- Chat History --> */}
                        <div className="col app-chat-history" id="app-chat-history">
                            <div className="chat-history-wrapper">
                                <div className="chat-history-header border-bottom p-2 ">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex overflow-hidden align-items-center">
                                            <Image src="/img/icons/main-menu.png" alt="" className='ml-2' style={{ cursor: 'pointer' }}
                                                width={15} height={15}
                                                onClick={() => setLeftSidebarOpen(prev => !prev)}

                                            />
                                            <div className="flex-shrink-0 ml-3 avatar avatar-online">
                                                <Image src="/img/avatars/5.png" alt="Avatar" className="rounded-circle ml-3" data-bs-toggle="sidebar" data-overlay="" data-target="#app-chat-sidebar-right" width={60} height={60} />
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ml-5">
                                                <h6 className="m-0 fw-normal">Felecia Rower</h6>
                                                <small className="user-status text-body">NextJS developer</small>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span className="btn btn-text-secondary text-secondary cursor-pointer d-sm-inline-flex d-none me-1 btn-icon rounded-pill">
                                                <Image
                                                    src='/img/icons/call.png'
                                                    alt='call'
                                                    width={15}
                                                    height={15}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-history-body ps ps--active-y p-4">
                                    <ul className="list-unstyled chat-history" style={{ height: 'calc(100vh - 30vh)', overflowY: 'auto' }}>




                                        <li className="chat-message chat-message-right">
                                            <div className="d-flex overflow-hidden">
                                                <div className="chat-message-wrapper flex-grow-1">
                                                    <div className="chat-message-text p-2  ">
                                                        <p className="mb-0">How can we help? We're here for you! 😄</p>
                                                    </div>
                                                    <div className="text-end text-body-secondary mt-1">
                                                        <i className="icon-base bx bx-check-double icon-16px text-success me-1"></i>
                                                        <small>6:00 AM</small>
                                                    </div>
                                                </div>
                                                <div className="user-avatar flex-shrink-0 ms-4">
                                                    <div className="avatar avatar-sm">
                                                        <Image src="/img/avatars/1.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="chat-message">
                                            <div className="d-flex overflow-hidden">
                                                <div className="user-avatar flex-shrink-0 me-4">
                                                    <div className="avatar avatar-sm">
                                                        <Image src="/img/avatars/5.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                                    </div>
                                                </div>
                                                <div className="chat-message-wrapper flex-grow-1">
                                                    <div className="chat-message-text p-2  ">
                                                        <p className="mb-0">Hey John, I am looking for the best admin template.</p>
                                                        <p className="mb-0">Could you please help me to find it out? 🤔</p>
                                                    </div>
                                                    <div className="chat-message-text p-2  mt-2">
                                                        <p className="mb-0">It should be Bootstrap 5 compatible.</p>
                                                    </div>
                                                    <div className="text-body-secondary mt-1">
                                                        <small>6:02 AM</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                    </ul>
                                    <div className="ps__rail-x" style={{ left: 0, bottom: -430 }}><div className="ps__thumb-x" tabIndex={0} style={{ left: 0, width: 0 }}>
                                    </div></div>

                                    <div className="ps__rail-y"
                                        style={{ top: 430, right: 0, height: 879 }}><div className="ps__thumb-y" tabIndex={0} style={{ top: 289, height: 590 }}></div></div></div>
                                {/* <!-- Chat message form --> */}
                                <div className="chat-history-footer shadow-xs">
                                    <form className="form-send-message d-flex justify-content-between align-items-center ">
                                        <input className="form-control message-input border-0 me-4 shadow-none" placeholder="Type your message here..." />
                                        <div className="message-actions d-flex align-items-center">
                                            <label htmlFor="attach-doc" className="form-label mb-0">
                                                <input type="file" id="attach-doc" hidden />
                                            </label>
                                            <button className="btn btn-primary">
                                                <span>send</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* <!-- /Chat History --> */}


                        {
                            isRightSidbarOpen && (
                                <div className="col app-chat-sidebar-right app-sidebar overflow-hidden" id="app-chat-sidebar-right">
                                    <div className="sidebar-header d-flex flex-column justify-content-center align-items-center flex-wrap px-6 pt-12">
                                        <div className="avatar avatar-xl avatar-online chat-sidebar-avatar">
                                            <Image src="/img/avatars/5.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                        </div>
                                        <h5 className="mt-4 mb-0">Felecia Rower</h5>
                                        <span>NextJS Developer</span>
                                        <i className="icon-base bx bx-x icon-lg cursor-pointer close-sidebar d-block" data-bs-toggle="sidebar" data-overlay="" data-target="#app-chat-sidebar-right"></i>
                                    </div>
                                    <div className="sidebar-body p-6 pt-0 ps">
                                        <div className="my-6">
                                            <p className="text-uppercase mb-1 text-body-secondary">About</p>
                                            <p className="mb-0">It is a long established fact that a reader will be distracted by the readable content .</p>
                                        </div>
                                        <div className="my-6">
                                            <p className="text-uppercase mb-1 text-body-secondary">Personal Information</p>
                                            <ul className="list-unstyled d-grid gap-4 mb-0 ms-2 py-2 text-heading">
                                                <li className="d-flex align-items-center">
                                                    <i className="icon-base bx bx-envelope"></i>
                                                    <span className="align-middle ms-2">josephGreen@email.com</span>
                                                </li>
                                                <li className="d-flex align-items-center">
                                                    <i className="icon-base bx bx-phone-call"></i>
                                                    <span className="align-middle ms-2">+1(123) 456 - 7890</span>
                                                </li>
                                                <li className="d-flex align-items-center">
                                                    <i className="icon-base bx bx-time-five"></i>
                                                    <span className="align-middle ms-2">Mon - Fri 6AM - 8PM</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="d-flex mt-6">
                                            <button className="btn btn-danger w-60" data-bs-toggle="sidebar" data-overlay="" data-target="#app-chat-sidebar-right">Delete Contact<i className="icon-base bx bx-trash icon-sm ms-2"></i></button>
                                        </div>
                                        <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
                                            <div className="ps__thumb-x" tabIndex={0} style={{ left: 0, bottom: 0 }}>
                                            </div>
                                        </div>
                                        <div className="ps__rail-y" style={{ left: 0, bottom: 0 }}>
                                            <div className="ps__thumb-y" tabIndex={0} style={{ left: 0, bottom: 0 }}></div></div>


                                    </div>
                                </div>
                            )
                        }


                        <div className="app-overlay"></div>
                    </div>
                </div>

            </div>


            <div className="content-backdrop fade"></div>

        </div>
    )

}