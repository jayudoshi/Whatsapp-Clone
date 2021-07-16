// $("#newGrpSideBar").off('scroll')
const scrollTop = Math.floor($("#newGrpSideBar").scrollTop() + $("#newGrpSideBar").height());
const totalHeight = $("#newGrpSideBarContent").height();
if(scrollTop === totalHeight){
    let url = "";
    console.log("Users Length:" + users.length)
    if(searchText === "")
        url = config.baseUrl + "/users?contactLength=" + users.length
    else
        url = config.baseUrl + "/users?searchText=" + searchText + "&contactLength=" + users.length
    fetch(url , {
        method: "GET",
        headers:{
            'Authorization' : 'Bearer ' + localStorage.getItem('token')
        },
    })
    .then(resp => resp.json())
    .then(resp => {
        console.log(resp)
        if(resp.err){
            console.log(resp.err)
        }
        console.log(resp.users);
        props.setUser(...prevState => (
            [...prevState , resp.users]
        ))
        if(resp.users.length === 0){
            $("#newGrpSideBar").off('scroll')
            // $("#newGrpSideBar").scroll(handleFetch)
        }
    })
}