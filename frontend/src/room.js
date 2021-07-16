let room = [
    {
        name: "Room-1",
        id: "1",
        members: [{
            _id: "2",
            username: "timir"
        } , {
            _id: "1",
            username: "jay"
        }],
        chats: [{
            from:{
                _id: "2",
                username: "timir"
            },
            msg:"Test Msg 3",
            timestamp:"9:36am",
            roomId:"1"
        },{
            from:{
                _id: "2",
                username: "timir"
            },
            msg:"Test Msg 3",
            timestamp:"9:36am",
            roomId:"1"
        }]
    },{
        name: "Room-3",
        id: "2",
        members: [{
            _id: "2",
            username: "timir"
        } , {
            _id: "1",
            username: "jay"
        }],
        chats: [{
            from:{
                _id: "2",
                username: "timir"
            },
            msg:"Test Msg 3",
            timestamp:"9:36am",
            roomId:"1"
        },{
            from:{
                _id: "2",
                username: "timir"
            },
            msg:"Test Msg 3",
            timestamp:"9:36am",
            roomId:"1"
        }]
    }
]

export default room;