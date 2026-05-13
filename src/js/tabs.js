const tabBtns    = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => {
      b.classList.remove('border-primary-400', 'text-primary-400');
      b.classList.add('border-transparent', 'text-neutral-500');
    });
    tabContents.forEach(c => c.classList.add('hidden'));
    btn.classList.add('border-primary-400', 'text-primary-400');
    btn.classList.remove('border-transparent', 'text-neutral-500');
    document.getElementById(`tab-${target}`)?.classList.remove('hidden');
  });
});
