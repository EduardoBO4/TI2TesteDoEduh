// 1. Constantes e Dados Falsos (Mock) que estavam faltando
const mockJSON = {
    posts: [
        {
            imagemUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            titulo: "Troca de Fiação",
            legenda: "Serviço completo de troca de fiação em residência antiga."
        },
        {
            imagemUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            titulo: "Instalação de Painel",
            legenda: "Quadro de distribuição montado e organizado."
        }
    ]
};

// ==========================================
// CONTROLES DE MENU E PERFIL
// ==========================================
function toggleMenu() {
    const menu = document.getElementById('dropdown-menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

function toggleProfile() {
    const profileSection = document.getElementById('profile-section');
    const noProfileMsg = document.getElementById('no-profile');
    
    if (profileSection.style.display === 'none' || profileSection.style.display === '') {
        profileSection.style.display = 'block';
        noProfileMsg.style.display = 'none';
    } else {
        profileSection.style.display = 'none';
        noProfileMsg.style.display = 'block';
    }
}

// ==========================================
// CONTROLES DO MODAL (CRIAR POST)
// ==========================================
const modalOverlay = document.getElementById('post-modal-overlay');
const btnOpenModal = document.getElementById('open-post-modal-btn');
const btnCloseModal = document.getElementById('close-post-modal');
const btnCancelModal = document.getElementById('pm-cancel-btn');

btnOpenModal.addEventListener('click', () => modalOverlay.style.display = 'flex');
btnCloseModal.addEventListener('click', () => modalOverlay.style.display = 'none');
btnCancelModal.addEventListener('click', () => modalOverlay.style.display = 'none');

const inputImgUrl = document.getElementById('pm-img-url');
const previewImg = document.getElementById('pm-preview-img');
const placeholderImg = document.getElementById('pm-img-placeholder');

inputImgUrl.addEventListener('input', (e) => {
    const url = e.target.value;
    if (url.trim() !== '') {
        previewImg.src = url;
        previewImg.style.display = 'block';
        placeholderImg.style.display = 'none';
    } else {
        previewImg.style.display = 'none';
        placeholderImg.style.display = 'flex';
    }
});

// ==========================================
// COMUNICAÇÃO COM API E RENDERIZAÇÃO (JSON)
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    carregarPosts();
    // 2. Chamei a função que evita o travamento da tela
    carregarReviewsMock(); 
});

async function carregarPosts() {
    const postsList = document.getElementById('portfolio-posts-list');
    const galleryGrid = document.getElementById('portfolio-grid');
    
    postsList.innerHTML = '<p>Carregando portfólio...</p>';

    try {
        let posts = [];
        try {
            const resposta = await fetch(`${API_BASE_URL}/posts`);
            if(resposta.ok) posts = await resposta.json();
            else throw new Error("API não retornou OK");
        } catch (e) {
            console.warn("Servidor Java indisponível ou rota inválida. Carregando dados falsos (Mock).");
            posts = mockJSON.posts;
        }

        postsList.innerHTML = '';
        galleryGrid.innerHTML = '';

        if (posts.length === 0) {
            postsList.innerHTML = '<p>Nenhum trabalho publicado ainda.</p>';
            return;
        }

        posts.forEach(post => {
            postsList.innerHTML += `
                <div class="post-item">
                    ${post.imagemUrl ? `<img src="${post.imagemUrl}" alt="Trabalho" class="post-img">` : ''}
                    <div class="post-content">
                        <h4>${post.titulo || 'Serviço Realizado'}</h4>
                        <p>${post.legenda}</p>
                    </div>
                </div>
            `;

            if (post.imagemUrl) {
                galleryGrid.innerHTML += `<img src="${post.imagemUrl}" class="gallery-img" alt="Galeria">`;
            }
        });

    } catch (erro) {
        postsList.innerHTML = '<p style="color:red;">Erro ao carregar os posts.</p>';
        console.error(erro);
    }
}

document.getElementById('pm-publish-btn').addEventListener('click', async () => {
    const desc = document.getElementById('pm-desc').value;
    const imgUrl = document.getElementById('pm-img-url').value;
    const tagClient = document.getElementById('pm-client-tag').value;

    if (!desc) { alert("A descrição é obrigatória!"); return; }

    const novoPost = {
        idprestador: 1, 
        titulo: tagClient ? `Atendimento para @${tagClient}` : 'Novo Serviço',
        legenda: desc,
        imagemUrl: imgUrl
    };

    try {
        const resposta = await fetch(`${API_BASE_URL}/post`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoPost)
        });

        if (resposta.status === 201) {
            alert('Post publicado com sucesso!');
            modalOverlay.style.display = 'none';
            carregarPosts(); 
        } else {
            alert('Aviso: Como o back-end pode estar desligado, vamos fingir que salvou e atualizar a página.');
            location.reload(); 
        }
    } catch (e) {
        alert("Servidor local não encontrado, atualize a página para limpar o formulário.");
        location.reload();
    }
});

// 3. Criada a função de mock para os reviews para o script não quebrar
function carregarReviewsMock() {
    const reviewsBody = document.getElementById('reviews-body');
    if(reviewsBody) {
        reviewsBody.innerHTML = '<p style="font-size:0.9rem; color:#666;">Ainda não há avaliações cadastradas.</p>';
    }
}