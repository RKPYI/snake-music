const startBtn = document.getElementById('startBtn');
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const loading = document.getElementById('loading');
startBtn.addEventListener('click', function() {
    menu.style.display = 'none';
    game.style.display = 'flex';
    loading.style.display = 'flex';
    start();
})