document.addEventListener("DOMContentLoaded", function() {
    let ok = "success"
    let bookList = document.querySelector('ul#list')
    let showPanel = document.querySelector('div#show-panel')
    let currentUserId = 2
    let currentUserName;
    
    getUsers()
    .then(data=> {
        for(let user of data){
            if(user.id === currentUserId){
                currentUserName = user.username
            }
        }
    })
    //list books
        getBooks()
        .then(data => {
            data.forEach((book)=>{
                let li = document.createElement('li')
                li.textContent = book.title
                li.id = book.id
                bookList.append(li)
            })
        })
    
    
    //show details and likers
        bookList.addEventListener('click', (e)=>{
            if(e.target.tagName === "LI"){
                  getBooks()
                  .then(data=>{
                    data.forEach(book=>{
                        if(e.target.textContent === book.title){
    
                            showPanel.innerHTML = `<div id='${book.id}'><img src="${book.img_url}" alt=""><h1>${book.title}</h1><h2>${book.subtitle}</h2><h2>${book.author}</h2><p>${book.description}</p><ul id="likerList"></ul><button id='like' class='btn'>Like</button></div>`
                            book.users.forEach((user)=>{
                                let li = document.createElement('li')
                                li.textContent = user.username
                                showPanel.querySelector('ul').append(li)
                                // if use has already liked the book, button changes to 'unlike'
                                if(user.id === currentUserId){
                                    showPanel.querySelector('.btn').textContent = "Unlike"
                                    showPanel.querySelector('.btn').id = "Unlike"
                                }
                            
                            })
                        }
                    })
                })
            }
        })
   // like a book and send patch
        showPanel.addEventListener('click',(e)=>{    
          
            if(e.target.id === 'like'){
                console.log('like')
                let body = {} 
                getBooks()
                .then(data =>{
                    for(let book of data){
                        if(book.id === parseInt(showPanel.querySelector('div').id)){
                                body = {users:[...book.users, {"id":currentUserId, "username": currentUserName}]}
                                console.log(body)

                            fetch(`http://localhost:3000/books/${parseInt(showPanel.querySelector('div').id)}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-type': 'application/json',
                                    Accept: 'application/json'
                                },
                                body: JSON.stringify(body)
                                })
                            
                            .then(res => res.json())
                            .then(data => {
                                showPanel.querySelector('ul').innerHTML=""
                                data.users.forEach((user)=>{
                                    let li = document.createElement('li')
                                    li.textContent = user.username
                                    showPanel.querySelector('ul').append(li)
                                })
                            })
                        }
                    }
                })
                document.querySelector('.btn').innerText = 'Unlike'
                document.querySelector('.btn').id = 'Unlike'
                     
            
            }else{console.log("unlike")
                //remove username from DOM
                getBooks()
                .then(data=>{
                    for(let book of data){
                        if(book.id === parseInt(showPanel.querySelector('div').id)){
                            let users = book.users
                            let newUsers = users.filter((user)=> user.username !== currentUserName)
                            showPanel.querySelector('ul').innerHTML = ""
                            
                            fetch(`http://localhost:3000/books/${showPanel.querySelector('div').id}`,{
                                method: 'PATCH',
                                headers: {
                                    'Content-type':'application/json',
                                    Accept: 'application/json'
                                },
                                body: JSON.stringify({"users": newUsers})
                            })
                                .then(res=>res.json())
                                .then(data=> {
                                    data.users.forEach(user =>{
                                        let li = document.createElement('li')
                                        li.textContent = user.username
                                        showPanel.querySelector('ul').append(li)
                                    })
                                })


                            
                        }
                    }
                    let button = showPanel.querySelector('.btn')
                    button.textContent = "Like"
                    button.id = 'like'
                })
                //remove user data from list in DB
                //change button text to 'like'
                }
               
          
                
        })    
    function getUsers(){
        return fetch('http://localhost:3000/users').then(res=> res.json())
    }
    function getBooks(){
            return fetch('http://localhost:3000/books').then(res=>res.json())
    }

})
    

//notes:  WHen like button is hit, the user list for the book will update will only update with the current user's info and delete the rest
    
    


