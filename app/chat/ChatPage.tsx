'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';



export default function ChattingPage() {

    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [isRightSidbarOpen, setRightSidebarOpen] = useState(false);

    const handleLeftBar = () => {

    }





    return (
        <div>
            {/* // <!-- Content --> */}
            <div className="container-xxl flex-grow-1 container-p-y chat-wrapper">

                <div className="app-chat card overflow-hidden">
                    <div className="row g-0">
                        {/* <div
                            className={`col app-chat-sidebar-left app-sidebar overflow-hidden ${isLeftSidebarOpen ? 'show' : ''
                                }`}
                            id="app-chat-sidebar-left"
                        >
                            <div className="chat-sidebar-left-user sidebar-header d-flex flex-column justify-content-center align-items-center flex-wrap px-6 pt-12">
                                <div className="avatar avatar-xl avatar-online chat-sidebar-avatar">
                                    <Image src="/img/avatars/1.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                </div>
                                <h5 className="mt-4 mb-0">John Doe</h5>
                                <span>Admin</span>
                                <i className="icon-base bx bx-x icon-lg cursor-pointer close-sidebar" data-bs-toggle="sidebar" data-target="#app-chat-sidebar-left"></i>
                            </div>
                            <div className="sidebar-body px-6 pb-6 ps">
                                <div className="my-6">
                                    <p className="text-uppercase text-body-secondary mb-1">Settings</p>
                                    <ul className="list-unstyled d-grid gap-4 ms-2 pt-2 text-heading">
                                        <li className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <i className="icon-base bx bx-bell me-1"></i>
                                                <span className="align-middle">Notification</span>
                                            </div>
                                            <div className="form-check form-switch mb-0 me-1">
                                                <input type="checkbox" className="form-check-input" />
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="d-flex mt-6">
                                    <button className="btn btn-primary w-60" data-bs-toggle="sidebar" data-overlay="" data-target="#app-chat-sidebar-left">
                                        <i className="icon-base bx bx-log-out icon-sm me-2"></i>
                                        Logout
                                    </button>
                                </div>
                                <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
                                    <div className="ps__thumb-x" tabIndex={0} style={{ left: 0, width: 0 }}></div>
                                </div>
                                <div className="ps__rail-y" style={{ top: 0, height: 0 }}>
                                    <div className="ps__thumb-y" tabIndex={0} style={{ top: 0, height: 0 }}>
                                    </div>
                                </div>
                            </div>
                        </div> */}




                        {/* <!-- Chat & Contacts --> */}
                        {/* <div className="col app-chat-contacts app-sidebar flex-grow-0 overflow-hidden border-end" id="app-chat-contacts"> */}
                        
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


                                    <li className="chat-contact-list-item mb-1 chat-active">
                                        <a className="d-flex align-items-center">
                                            <div className="flex-shrink-0 avatar avatar-online">
                                                <Image src="/img/avatars/6.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h6 className="chat-contact-name text-truncate m-0 fw-normal">Waldemar Mannering</h6>
                                                    <small className="chat-contact-list-item-time">5 Minutes</small>
                                                </div>
                                                <small className="chat-contact-status text-truncate">Refer friends. Get rewards.</small>
                                            </div>
                                        </a>
                                    </li>


                                    <li className="chat-contact-list-item mb-1">
                                        <a className="d-flex align-items-center">
                                            <div className="flex-shrink-0 avatar avatar-offline">
                                                <Image src="/img/avatars/5.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h6 className="chat-contact-name text-truncate fw-normal m-0">Felecia Rower</h6>
                                                    <small className="chat-contact-list-item-time">30 Minutes</small>
                                                </div>
                                                <small className="chat-contact-status text-truncate">I will purchase it for sure. 👍</small>
                                            </div>
                                        </a>
                                    </li>


                                    <li className="chat-contact-list-item mb-0">
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
                                    <li className="chat-contact-list-item">
                                        <a className="d-flex align-items-center">
                                            <div className="flex-shrink-0 avatar">
                                                <Image src="/img/avatars/5.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <h6 className="chat-contact-name text-truncate m-0 fw-normal">Natalie Maxwell</h6>
                                                <small className="chat-contact-status text-truncate">UI/UX Designer</small>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="chat-contact-list-item">
                                        <a className="d-flex align-items-center">
                                            <div className="flex-shrink-0 avatar">
                                                <Image src="/img/avatars/5.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <h6 className="chat-contact-name text-truncate m-0 fw-normal">Jess Cook</h6>
                                                <small className="chat-contact-status text-truncate">Business Analyst</small>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="chat-contact-list-item">
                                        <a className="d-flex align-items-center">
                                            <div className="avatar d-block flex-shrink-0">
                                                <span className="avatar-initial rounded-circle bg-label-primary">LM</span>
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <h6 className="chat-contact-name text-truncate m-0 fw-normal">Louie Mason</h6>
                                                <small className="chat-contact-status text-truncate">Resource Manager</small>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="chat-contact-list-item">
                                        <a className="d-flex align-items-center">
                                            <div className="flex-shrink-0 avatar">
                                                <Image src="/img/avatars/7.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <h6 className="chat-contact-name text-truncate m-0 fw-normal">Krystal Norton</h6>
                                                <small className="chat-contact-status text-truncate">Business Executive</small>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="chat-contact-list-item">
                                        <a className="d-flex align-items-center">
                                            <div className="flex-shrink-0 avatar">
                                                <Image src="/img/avatars/5.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <h6 className="chat-contact-name text-truncate m-0 fw-normal">Stacy Garrison</h6>
                                                <small className="chat-contact-status text-truncate">Marketing Ninja</small>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="chat-contact-list-item">
                                        <a className="d-flex align-items-center">
                                            <div className="avatar d-block flex-shrink-0">
                                                <span className="avatar-initial rounded-circle bg-label-success">CM</span>
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <h6 className="chat-contact-name text-truncate m-0 fw-normal">Calvin Moore</h6>
                                                <small className="chat-contact-status text-truncate">UX Engineer</small>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="chat-contact-list-item">
                                        <a className="d-flex align-items-center">
                                            <div className="flex-shrink-0 avatar">
                                                <Image src="/img/avatars/6.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <h6 className="chat-contact-name text-truncate m-0 fw-normal">Mary Giles</h6>
                                                <small className="chat-contact-status text-truncate">Account Department</small>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="chat-contact-list-item">
                                        <a className="d-flex align-items-center">
                                            <div className="flex-shrink-0 avatar">
                                                <Image src="/img/avatars/6.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <h6 className="chat-contact-name text-truncate m-0 fw-normal">Waldemar Mannering</h6>
                                                <small className="chat-contact-status text-truncate">AWS Support</small>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="chat-contact-list-item">
                                        <a className="d-flex align-items-center">
                                            <div className="avatar d-block flex-shrink-0">
                                                <span className="avatar-initial rounded-circle bg-label-danger">AJ</span>
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <h6 className="chat-contact-name text-truncate m-0 fw-normal">Amy Johnson</h6>
                                                <small className="chat-contact-status text-truncate">Frontend Developer</small>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="chat-contact-list-item">
                                        <a className="d-flex align-items-center">
                                            <div className="flex-shrink-0 avatar">
                                                <Image src="/img/avatars/5.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <h6 className="chat-contact-name text-truncate m-0 fw-normal">Felecia Rower</h6>
                                                <small className="chat-contact-status text-truncate">Cloud Engineer</small>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="chat-contact-list-item mb-0">
                                        <a className="d-flex align-items-center">
                                            <div className="flex-shrink-0 avatar">
                                                <Image src="/img/avatars/7.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
                                            </div>
                                            <div className="chat-contact-info flex-grow-1 ms-4">
                                                <h6 className="chat-contact-name text-truncate m-0 fw-normal">William Stephens</h6>
                                                <small className="chat-contact-status text-truncate">Backend Developer</small>
                                            </div>
                                        </a>
                                    </li>
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
                                    <ul className="list-unstyled chat-history" style={{ height: 'calc(100vh - 45vh)', overflowY: 'auto' }}>
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
                                        <li className="chat-message chat-message-right">
                                            <div className="d-flex overflow-hidden">
                                                <div className="chat-message-wrapper flex-grow-1">
                                                    <div className="chat-message-text p-2 ">
                                                        <p className="mb-0">sneat has all the components you'll ever need in a app.</p>
                                                    </div>
                                                    <div className="text-end text-body-secondary mt-1">
                                                        <i className="icon-base bx bx-check-double icon-16px text-success me-1"></i>
                                                        <small>6:03 AM</small>
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
                                                    <div className="chat-message-text p-2 ">
                                                        <p className="mb-0">Looks clean and fresh UI. 😃</p>
                                                    </div>
                                                    <div className="chat-message-text p-2  mt-2">
                                                        <p className="mb-0">It's perfect for my next project.</p>
                                                    </div>
                                                    <div className="chat-message-text p-2  mt-2">
                                                        <p className="mb-0">How can I purchase it?</p>
                                                    </div>
                                                    <div className="text-body-secondary mt-1">
                                                        <small>6:05 AM</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="chat-message chat-message-right">
                                            <div className="d-flex overflow-hidden">
                                                <div className="chat-message-wrapper flex-grow-1">
                                                    <div className="chat-message-text p-2 ">
                                                        <p className="mb-0">Thanks, you can purchase it.</p>
                                                    </div>
                                                    <div className="text-end text-body-secondary mt-1">
                                                        <i className="icon-base bx bx-check-double icon-16px text-success me-1"></i>
                                                        <small>6:06 AM</small>
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
                                                    <div className="chat-message-text p-2 ">
                                                        <p className="mb-0">I will purchase it for sure. 👍</p>
                                                    </div>
                                                    <div className="chat-message-text p-2  mt-2">
                                                        <p className="mb-0">Thanks.</p>
                                                    </div>
                                                    <div className="text-body-secondary mt-1">
                                                        <small>6:08 AM</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="chat-message chat-message-right">
                                            <div className="d-flex overflow-hidden">
                                                <div className="chat-message-wrapper flex-grow-1">
                                                    <div className="chat-message-text p-2 ">
                                                        <p className="mb-0">Great, Feel free to get in touch.</p>
                                                    </div>
                                                    <div className="text-end text-body-secondary mt-1">
                                                        <i className="icon-base bx bx-check-double icon-16px text-success me-1"></i>
                                                        <small>6:6 AM</small>
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
                                                    <div className="chat-message-text p-2 ">
                                                        <p className="mb-0">Do you have design files for sneat?</p>
                                                    </div>
                                                    <div className="text-body-secondary mt-1">
                                                        <small>6:15 AM</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="chat-message chat-message-right">
                                            <div className="d-flex overflow-hidden">
                                                <div className="chat-message-wrapper flex-grow-1 w-50">
                                                    <div className="chat-message-text p-2">
                                                        <p className="mb-0">Yes that's correct documentation file, Design files are included with the template.</p>
                                                    </div>
                                                    <div className="text-end text-body-secondary mt-1">
                                                        <i className="icon-base bx bx-check-double icon-16px me-1"></i>
                                                        <small>6:15 AM</small>
                                                    </div>
                                                </div>
                                                <div className="user-avatar flex-shrink-0 ms-4">
                                                    <div className="avatar avatar-sm">
                                                        <Image src="/img/avatars/1.png" alt="Avatar" className="rounded-circle" width={60} height={60} />
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
                                            <span className="btn btn-text-secondary btn-icon rounded-pill cursor-pointer">
                                                <i className="speech-to-text icon-base bx bx-microphone icon-md text-heading"></i>
                                            </span>
                                            <label htmlFor="attach-doc" className="form-label mb-0">
                                                <span className="btn btn-text-secondary btn-icon rounded-pill cursor-pointer mx-1">
                                                    <i className="icon-base bx bx-paperclip icon-md text-heading"></i>
                                                </span>
                                                <input type="file" id="attach-doc" hidden />
                                            </label>
                                            <button className="btn btn-primary d-flex send-msg-btn">
                                                <span className="align-middle d-md-inline-block d-none">Send</span>
                                                <i className="icon-base bx bx-paper-plane icon-sm ms-md-2 ms-0"></i>
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
                                        <div className="my-6">
                                            <p className="text-uppercase text-body-secondary mb-1">Options</p>
                                            <ul className="list-unstyled d-grid gap-4 ms-2 py-2 text-heading">
                                                <li className="cursor-pointer d-flex align-items-center">
                                                    <i className="icon-base bx bx-bookmark"></i>
                                                    <span className="align-middle ms-2">Add Tag</span>
                                                </li>
                                                <li className="cursor-pointer d-flex align-items-center">
                                                    <i className="icon-base bx bx-star"></i>
                                                    <span className="align-middle ms-2">Important Contact</span>
                                                </li>
                                                <li className="cursor-pointer d-flex align-items-center">
                                                    <i className="icon-base bx bx-image-alt"></i>
                                                    <span className="align-middle ms-2">Shared Media</span>
                                                </li>
                                                <li className="cursor-pointer d-flex align-items-center">
                                                    <i className="icon-base bx bx-trash"></i>
                                                    <span className="align-middle ms-2">Delete Contact</span>
                                                </li>
                                                <li className="cursor-pointer d-flex align-items-center">
                                                    <i className="icon-base bx bx-block"></i>
                                                    <span className="align-middle ms-2">Block Contact</span>
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