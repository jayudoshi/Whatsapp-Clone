const users = [
    {
        _id: "1",
        username:"jay",
        name:"Jay",
        about:"Its Life",
    },
    {
        _id: "2",
        username:"reena",
        name:"Reena",
        about:"Its Life Enjoy",
    },
    {
        _id: "3",
        username:"timir",
        name:"Timir",
        about:"Real",
    },
    {
        _id: "4",
        username:"noni",
        name:"Noni",
        about:"Noni",
    },
    {
        _id: "5",
        username:"prutha",
        name:"Prutha",
        about:"Prutha",
    },
    {
        _id: "6",
        username:"disha",
        name:"Disha",
        about:"Disha",
    },
    {
        _id: "7",
        username:"Manan",
        name:"Manan",
        about:"Manan",
    },
    
]

export default users.sort(function(a, b){
    let x = a.name.toLowerCase();
    let y = b.name.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  });