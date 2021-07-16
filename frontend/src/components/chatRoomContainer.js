// import React, { useState } from 'react';

// function RenderChatRoom(props){
    
//     const [member,setMember] = useState(props.room.member.filter(mem => mem !== props.user.user._id)[0]);
    
//     return (
//         <div className="row componentHeader">
//             <div className="h-100 row m-auto">
//                 <div className="col-1 m-auto p-0 m-0">
//                     <Avatar src="member.profilePic" className={classes.large}  style={{margin:"0px"}} />
//                 </div>
//                 <div className= {info ? "offset-2 col-8" : "col-10"} style={{margin:"auto" , padding:"0px"}}>
//                     <h3 className="m-0 p-0">{member.name}</h3>
//                     <p className="m-0 p-0 w-100" style={{height:"24px" , overflow:"hidden" ,textOverflow: "ellipsis" , whiteSpace: "nowrap"}}>online or last seen a 16.30</p>
//                 </div>
//                 <div className="col-1 m-auto p-0 m-0" style={{textAlign: "right"}} >
//                     <button className="p-0 m-0" id="chatRoomPopover" style={{backgroundColor: "inherit" , border:"0px" , color:"white"}}>
//                         <MoreVertIcon fontSize="large" />
//                     </button>
//                     <UncontrolledPopover trigger="legacy" placement="bottom-end" target="chatRoomPopover">
//                         <PopoverBody className="p-0" style={{width:"180px" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
//                             <div className="container p-2">
//                                 <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Select Msg</button>
//                                 <button onClick={() => {setInfo(true)}} className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Contact Info</button>
//                                 <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Clear Chat</button>
//                                 <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Exit</button>
//                             </div>
//                         </PopoverBody>
//                     </UncontrolledPopover>
//                 </div>
//             </div>
//         </div>
//     )
// }