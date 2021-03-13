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
           <td class ="firstname"><span>${u.firstname}</span></td>
           <td class ="lastname"><span>${u.lastname}</span></td>
           <td class ="capsule"><span>${u.capsule}</span></td>
           <td class ="age"><span>${u.age}</span></td>
           <td class ="city"><span>${u.city}</span></td>
           <td class ="gender"><span>${u.gender}</span></td>
           <td class ="hobby"><span>${u.hobby}</span></td>
           <td class="td-btns-before switch-btn">
               <button class ="editBtn">edit</button>
               <button class ="deleteBtn">delete</button>
           </td>
           <td class="td-btns-after switch-btn diplayswitch">
               <button class ="submit-btn">Submit</button>
               <button class ="cancel-btn">Cancel</button>
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
    const submitBtn = document.querySelectorAll('.submit-btn')
    for (const btn of submitBtn) {
        btn.addEventListener('click', handleSubmit)
    }
    const cancelBtn = document.querySelectorAll('.cancel-btn')
    for (const btn of cancelBtn) {
        btn.addEventListener('click', handleCancel)
    }

}
/*
-----------------------------------------Handle Actions-----------------------------------
*/

//----------------Delete  Function-----------
function handleDeleteUser(e) {
    let item = e.target.closest('tr')
    item.remove()
    const index = findIndexInData(item, usersInfo)
    usersInfo.splice(index, 1);
    updateLocal(usersInfo)

}
// -----------------Edit Function------------
function handleEditUser(e) {
    let item = e.target.closest('tr')
    const index = findIndexInData(item, usersInfo)
    let tds = item.children
    for (const td of tds) {
        if (!(td.classList.contains("switch-btn") || (td.classList.contains("id-span")))) {
            td.innerHTML = `<input type="text" value="${td.innerText}">`
            td.addEventListener('change', (e) => {
                let parent = e.target.parentNode;
                let classNodes = parent.className;
                usersInfo[index][`${classNodes}`] = e.target.value

            })
        }
    }
    tds[9].classList.remove('diplayswitch')
    item.insertBefore(tds[9], tds[8]);
    tds[9].classList.add('diplayswitch')
}
//--------------- Submit function-------------
function handleSubmit(e) {
    let item = e.target.closest('tr')
    let tds = item.children
    for (const td of tds) {
        if (!(td.classList.contains("switch-btn") || (td.classList.contains("id-span")))) {
            td.innerHTML = `<span>${td.firstElementChild.value}</span>`
            updateLocal(usersInfo)
        }
    }
    console.log(usersInfo);
    tds[9].classList.remove('diplayswitch')
    item.insertBefore(tds[9], tds[8]);
    tds[9].classList.add('diplayswitch')
}
//--------------- Cancel function-------------
function handleCancel(e) {
    let getCurrentLocal = JSON.parse(localStorage.getItem('userObj'))
    let item = e.target.closest('tr')
    let tds = item.children
    const index = findIndexInData(item, getCurrentLocal)
    let obj = getCurrentLocal[index];
    let objVal = Object.values(obj)
    for (let i = 0; i < tds.length; i++) {
        if (!(tds[i]).classList.contains("switch-btn")) {
            tds[i].innerHTML = `<span>${objVal[i]}</span>`
        }
    }
    tds[9].classList.remove('diplayswitch')
    item.insertBefore(tds[9], tds[8]);
    tds[9].classList.add('diplayswitch')
}





//----get ID ,Index functions-----
function getID(element) {
    return parseInt(element.getAttribute('data-id'))
}
function findIndexInData(el, data) {
    return data.map(item => item.id).indexOf(getID(el))
}