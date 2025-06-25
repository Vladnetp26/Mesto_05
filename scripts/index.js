// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const popups = document.querySelectorAll('.popup');
const editPopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const editForm = document.forms['edit-profile'];
const addForm = document.forms['new-place'];
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// Исходные карточки
const initialCards = [
  {
    name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg',
    alt: 'Горный пейзаж Архыза'
  },
  {
    name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg',
    alt: 'Зимний лес в Челябинской области'
  },
  {
    name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg',
    alt: 'Панельные дома в Иваново'
  },
  {
    name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
    alt: 'Горный хребет на Камчатке'
  },
  {
    name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg',
    alt: 'Железная дорога в Холмогорском районе'
  },
  {
    name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg',
    alt: 'Скалистый берег Байкала'
  }
];

// @todo: Функция создания карточки
function createCard(cardData, deleteCallback, likeCallback, openImageCallback) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.alt || `Изображение места: ${cardData.name}`;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => deleteCallback(cardElement));
  likeButton.addEventListener('click', likeCallback);
  cardImage.addEventListener('click', () => openImageCallback(cardData));

  return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// Обработчик лайка карточки
function handleLikeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

// Функция открытия изображения
function openImagePopup(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.alt || cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(imagePopup);
}

// Универсальные функции для работы с попапами
function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

// Закрытие попапа по Esc
function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) closePopup(openedPopup);
  }
}

// Закрытие попапов по клику на оверлей и крестик
popups.forEach(popup => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup_is-opened') || 
        evt.target.classList.contains('popup__close')) {
      closePopup(popup);
    }
  });
});

// Обработчики открытия попапов
profileEditButton.addEventListener('click', () => {
  editForm.elements.name.value = profileTitle.textContent;
  editForm.elements.description.value = profileDescription.textContent;
  openPopup(editPopup);
});

profileAddButton.addEventListener('click', () => {
  openPopup(newCardPopup);
});

// Обработчики форм
editForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileTitle.textContent = editForm.elements.name.value;
  profileDescription.textContent = editForm.elements.description.value;
  closePopup(editPopup);
});

addForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  
  const newCardData = {
    name: addForm.elements['place-name'].value,
    link: addForm.elements.link.value,
    alt: `Изображение места: ${addForm.elements['place-name'].value}`
  };
  
  const newCard = createCard(
    newCardData,
    deleteCard,
    handleLikeCard,
    openImagePopup
  );
  
  placesList.prepend(newCard);
  addForm.reset();
  closePopup(newCardPopup);
});

// @todo: Вывести карточки на страницу
initialCards.forEach(cardData => {
  const cardElement = createCard(
    cardData,
    deleteCard,
    handleLikeCard,
    openImagePopup
  );
  placesList.append(cardElement);
});