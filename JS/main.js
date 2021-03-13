'use strict'

const usersEndPoint = `https://appleseed-wa.herokuapp.com/api/users/`
const container = document.querySelector('.container')
let table = document.createElement('table');
container.appendChild(table)

let usersInfo
let getLocal = JSON.parse(localStorage.getItem('userObj'))



/*
--------------------------------------------GLOBAL AND STORAGE---------------------------
*/

function updateLocal(info) {
    localStorage.setItem('userObj', JSON.stringify(info))
}
async function workWithGlobal() {

    if ((getLocal === null) || getLocal.length === 0) {
        usersInfo = await getUsers()
        createTable(usersInfo)
    } else {
        usersInfo = getLocal
        createTable(getLocal)
    }

}
workWithGlobal()

/*
-----------------------------------------Get API info-----------------------------------
*/

async function getExtraInfo(url) {
    let info = await fetch(url)
    let data = await info.json();
    return data
}
async function getUsers() {
    let callApi = await fetch(usersEndPoint);
    let data = await callApi.json();
    let users = await Promise.all(

        data.map(async u => {

            let extraInfo = await getExtraInfo(`${usersEndPoint}${u.id}`)
            return {
                id: u.id,
                firstname: u.firstName,
                lastname: u.lastName,
                capsule: u.capsule,
                age: extraInfo.age,
                city: extraInfo.city,
                gender: extraInfo.gender,
                hobby: extraInfo.hobby,
            }
        }))
    return users;
}
/*
-----------------------------------------Create Table-----------------------------------
*/

function createTable(users) {
    table.innerHTML = ''
    users.forEach(u => {
        table.innerHTML += `<tr data-id="${u.id}">
           <td class="id-span"><span>${u.id}</span></td>
           <td ><span>${u.firstname}</span></td>
           <td><span>${u.lastname}</span></td>
           <td><span>${u.capsule}</span></td>
           <td><span>${u.age}</span></td>
           <td><span>${u.city}</span></td>
           <td><span>${u.gender}</span></td>
           <td><span>${u.hobby}</span></td>
           <td class="td-btns"><button class ="editBtn">edit</button>
           <button class ="deleteBtn">delete</button>
           </td>
        </tr>`
    })
    addEventButtons()
}

/*
-----------------------------------------Add Event To Buttons-----------------------------------
*/

function addEventButtons() {
    const deleteBtn = document.querySelectorAll('.deleteBtn')
    for (const btn of deleteBtn) {
        btn.addEventListener('click', handleDeleteUser)
    }
    const editBtn = document.querySelectorAll('.editBtn')
    for (const btn of editBtn) {
        btn.addEventListener('click', handleEditUser)
    }
}

/*
-----------------------------------------Handle Actions-----------------------------------
*/

//-----Delete  Function
function handleDeleteUser(e) {
    let item = e.target.closest('tr')
    item.remove()
    const index = usersInfo.map(item => item.id).indexOf(getID(item))
    usersInfo.splice(index, 1);
    updateLocal(usersInfo)

}

function handleEditUser(e) {
    let tds = e.target.closest('tr').children
    console.log(tds)
    for (const td of tds) {
        if (!(td.classList.contains("td-btns") || (td.classList.contains("id-span")))) {
            td.innerHTML = `<input type="text" value="${td.innerText}">`
        } else if (td.classList.contains("td-btns")) {
            td.innerHTML = `<button class ="submit-btn">Submit</button>
            <button class ="cancel-btn">Cancel</button>`
        }
    }
    const submitBtn = document.querySelectorAll('.submit-btn')
    for(const btn of submitBtn){
        btn.addEventListener('click', saveValue)
    }
    const cancelBtn = document.querySelector('.cancel-btn')
}
function saveValue(e) {

    let tds = e.target.closest('tr').children
    console.log(tds)
    for (const td of tds) {
        console.log(td);
        if (!(td.classList.contains("td-btns") || (td.classList.contains("id-span")))) {
            td.innerHTML = `<span>${td.firstElementChild.value}</span>`
        }
    }
}




//----get ID function
function getID(element) {
    return parseInt(element.getAttribute('data-id'))
}