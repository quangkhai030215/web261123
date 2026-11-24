
// app.js : 영화 배열을 다루는 함수 6개 / 여상수(09) / 12주차
// average : 영화 배열 ⇒ 평균 평점(숫자)

const average = list => {
    let sum = 0;
    for (const m of list) sum += m.rating;
    return sum / list.length;
}
console.log("평균:", average(movies));


// best : 영화 배열 ⇒ 최고 평점 영화 객체
const best = list => {
    let top = list[0];

    for (const m of list) {
        if (m.rating > top.rating) top = m;
    }

    return top;
}
console.log("최고:", best(movies).title);


// filterByRating : 최소 평점 이상인 영화만 필터링
const filterByRating = (list, min) =>
    list.filter(m => m.rating >= min);

console.log("8점 이상:", filterByRating(movies, 8).length + "편");


// sortByRating : 평점이 높은 순서로 새 배열 만들기
const sortByRating = list =>
    [...list].sort((a, b) => b.rating - a.rating);

const sorted = sortByRating(movies);

console.log(
    "정렬 1위:", sorted[0].title,
    "\n원본 1번:", movies[0].title
);


// yearsSince : 개봉일로부터 지난 연도 계산
const yearsSince = dateStr =>
    new Date().getFullYear() - new Date(dateStr).getFullYear();

console.log(yearsSince(movies[1].date) + "년 전 개봉");


// posterUrl : 포스터 경로 ⇒ TMDB 이미지 주소
const posterUrl = (path, size) => {
    if (path.startsWith("http")) return path;

    return "https://image.tmdb.org/t/p/" + size + path;
}

console.log(posterUrl(movies[0].poster, "w342"));


// 페이지 제목과 영화 통계 표시
document.title = "내 영화 " + movies.length + "편";

console.table(sortByRating(movies));

document.getElementById("out").textContent =
    "평균 " + average(movies).toFixed(1) +
    "점, 최고점수 영화: " + best(movies).title;


// 좋아요한 영화 ID 저장
const likedIds = new Set();


// renderCards : 영화 배열 ⇒ 보드에 카드 생성
function renderCards(list) {
    const board = document.querySelector("#mine .board");

    board.innerHTML = "";

    for (const m of list) {
        const card = document.createElement("article");
        card.className = "card";

        if (m.rating >= 8) {
            card.classList.add("hot");
        }

        card.dataset.id = m.id;

        card.innerHTML = `
            <img class="poster"
                src="${posterUrl(m.poster, "w342")}"
                alt="${m.title} 포스터">

            <span class="badge">${m.rating}</span>

            <div class="info">
                <h2>${m.title}</h2>
                <p class="year">${m.date}</p>

                <button class="like ${likedIds.has(m.id) ? "liked" : ""}"
                    type="button"
                    aria-label="좋아요">
                    ♥
                </button>
            </div>
        `;

        board.appendChild(card);

        // 카드 클릭 시 영화 설명 표시
        card.addEventListener("click", (e) => {
            if (e.target.closest(".like")) return;

            alert(m.overview);
        });
    }

    document.getElementById("count").textContent =
        list.length + "편";

    if (list.length === 0) {
        board.classList.add("is-empty");
    } else {
        board.classList.remove("is-empty");
    }

    updateLikeCount();
}


// sortBy : 영화 배열, 키 이름, 내림차순 여부 ⇒ 정렬한 새 배열
function sortBy(list, key, desc) {
    const copy = [...list];

    copy.sort((a, b) => {
        if (typeof a[key] === "string") {
            return a[key].localeCompare(b[key]);
        }

        return a[key] - b[key];
    });

    if (desc) copy.reverse();

    return copy;
}


// applySort : 선택 상자 값으로 정렬해서 다시 그리기
function applySort() {
    renderCards(getView());
}


// getView : 검색어로 필터링한 뒤 정렬한 새 배열
function getView() {
    const keyword = document.getElementById("q")
        .value.trim().toLowerCase();

    const found = movies.filter(m =>
        m.title.toLowerCase().includes(keyword)
    );

    const key = document.getElementById("sort").value;

    return sortBy(found, key, key !== "title");
}


// 처음 화면 표시
applySort();


// 검색창 : 글자를 입력할 때마다 검색
document.getElementById("q").addEventListener("input", (e) => {
    renderCards(getView());
});


// 정렬 : 선택 상자가 바뀌면 다시 정렬
document.getElementById("sort").addEventListener("change", applySort);


// Event Delegation : .board에 Listener를 한 번만 등록
// 일반 함수에서 this는 이벤트가 등록된 .board를 가리킴
// e.target은 실제로 클릭한 요소를 가리킴

document.querySelector("#mine .board").addEventListener("click", function(e) {
    if (e.target.classList.contains("like")) {
        const card = e.target.closest(".card");
        const id = Number(card.dataset.id);

        if (likedIds.has(id)) {
            likedIds.delete(id);
        } else {
            likedIds.add(id);
        }

        e.target.classList.toggle("liked");

        updateLikeCount();
    }
});


// updateLikeCount : 좋아요한 영화 개수 표시
function updateLikeCount() {
    document.getElementById("likeCount").textContent =
        likedIds.size;
}


// Escape : 검색어를 지우고 전체 목록 다시 표시
document.getElementById("q").addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        e.target.value = "";
        renderCards(getView());
    }
});
