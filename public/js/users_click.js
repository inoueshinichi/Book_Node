// userInfo.ejsで使用する静的ファイル(JS)

window.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.user').forEach((elem) => {
        elem.addEventListener('click', (e) => {
            console.log(e.target.innerHTML);
        });
    });
}, false);
