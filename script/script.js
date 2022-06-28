
// Обработчик событийкоторый отслеживает загрузку событий
document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const prevButton = document.querySelector('#prev');
    const nextButton = document.querySelector('#next');
    const sendButton = document.querySelector('#send');

    const firebaseConfig = {
        apiKey: "AIzaSyB_zjLB73-xEIbt7kHvNDkhofNJo9zRwTw",
        authDomain: "testburger-49ed4.firebaseapp.com ",
        databaseURL: "https://testburger-49ed4-default-rtdb.firebaseio.com ",
        ProjectID: "testburger-49ed4",
        storageBucket: "testburger-49ed4.appspot.com ",
        messagingSenderId: "93566957677",
        AppID: "1: 93566957677:web: e87d10c6325b21440d2764",
        measurementId: "G-10FH9JHFMR"
    };

    // Initialize Firebase



    //Функция получения данных
    const getData = () => {
        formAnswers.textContent = 'LOAD';

        setTimeout(() => {
            const app = initializeApp(firebaseConfig);
            const analytics = getAnalytics(app);
            analytics.database().ref().child("questions").once("value")
                .then(span => playTest(span.value()))
        }, 1000)
    }


    // Обработчик собыйти открытия/закрытия модального окна
    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        getData();
    })

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    })

    // Функция запуска тестирования
    const playTest = (questions) => {

        const finalAnswers = [];
        let numberQuestion = 0;
        // Функция рендеринга ответов
        const renderAnswers = (index) => {
            questions[index].answers.forEach((answers) => {
                const answerItem = document.createElement('div');

                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answers.title}" name="answer" class="d-none" value="${answers.title}">
                <label for="${answers.title}" class="d-flex flex-column justify-content-between">
                  <img class="answerImg" src="${answers.url}" alt="burger">
                  <span>${answers.title}</span>
                </label>
                `;
                formAnswers.appendChild(answerItem);
            })
        }

        //Функция рендеринга вопросов + ответов
        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';

            if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                questionTitle.textContent = `${questions[indexQuestion].question}`;
                renderAnswers(indexQuestion);
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');
                nextButton.classList.remove('d-none');
            }

            if (numberQuestion === 0) {
                prevButton.classList.add('d-none');
            }

            if (numberQuestion === questions.length) {
                prevButton.classList.add('d-none');
                sendButton.classList.remove('d-none');
                nextButton.classList.add('d-none');

                formAnswers.innerHTML = `
                 <div class="form-group">
                    <label for="numberPhone">Enter your phone number</label>
                    <input type="phone" class="form-control" id="numberPhone">
                </div>
                `;
            }

            if (numberQuestion === questions.length + 1) {
                formAnswers.textContent = 'Спасибо за пройденный тест!';
                setTimeout(() => {
                    modalBlock.classList.remove('d-block')
                }, 2000);
            }
        }

        //Запускаем функция 
        renderQuestions(numberQuestion);


        const checAnswer = () => {
            const obj = {};
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');

            inputs.forEach((input, index) => {
                if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                }

                if (numberQuestion === questions.length) {
                    obj['Номер телефона'] = input.value;
                }
            })

            finalAnswers.push(obj);
        }


        //Обработчики событий кнопок next и prev
        nextButton.onclick = () => {
            checAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        }

        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        }

        sendButton.onclick = () => {
            checAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            firebase
                .database()
                .ref()
                .child('contacts')
                .push(finalAnswers)
            console.log(finalAnswers);
        }
    }
})
