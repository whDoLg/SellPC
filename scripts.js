const products = [
  {
    name: "Ігровий ПК Потужний",
    price: 30000,
    img: "images/pc1.jpg",
    description: "Intel i9, RTX 4080, 32GB RAM, SSD 1TB",
    category: "ПК"
  },
  {
    name: "Ігровий ПК Середній",
    price: 20000,
    img: "images/pc2.jpg",
    description: "Intel i5, RTX 3060, 16GB RAM",
    category: "ПК"
  },
  {
    name: "ПК для офісу",
    price: 10000,
    img: "images/pc3.jpg",
    description: "AMD Ryzen 3, Vega Graphics, 8GB RAM",
    category: "ПК"
  },
  {
    name: "Стіл геймерський",
    price: 4000,
    img: "images/table1.jpg",
    description: "Зручний геймерський стіл з LED-підсвіткою.",
    category: "Столи"
  },
  {
    name: "Навушники HyperX",
    price: 1200,
    img: "images/headphones1.jpg",
    description: "Якісний звук і мікрофон для ігор.",
    category: "Наушники"
  },
  {
    name: "Клавіатура Logitech",
    price: 1000,
    img: "images/keyboard1.jpg",
    description: "Механічна клавіатура з підсвіткою.",
    category: "Клавіатури"
  },
  {
    name: "Миша Razer",
    price: 800,
    img: "images/mouse1.jpg",
    description: "Швидка та точна миша для геймерів.",
    category: "Миші"
  },
  {
    name: "Sony PlayStation 5",
    price: 20000,
    img: "images/console1.jpg",
    description: "Консоль нового покоління.",
    category: "ПК"
  },
  {
    name: "Монітор MSI 27\"",
    price: 7000,
    img: "images/monitor1.jpg",
    description: "Full HD 144Hz ігровий монітор.",
    category: "ПК"
  }
];

const apiKey = 'a89c06ea2c3f3f57257fdcdbf3850b4c';

document.getElementById("delivery-location").addEventListener("change", function () {
  const city = this.value;
  const branchSelect = document.getElementById("nova-poshta-branches");
  branchSelect.innerHTML = '<option value="">Завантаження відділень...</option>';

  if (!city) return;


  fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      apiKey: apiKey,
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties: {
        FindByString: city
      }
    })
  })
  .then(response => response.json())
  .then(data => {
    const cityData = data.data.find(item => item.Description === city);
    if (!cityData) {
      branchSelect.innerHTML = '<option value="">Місто не знайдено</option>';
      return;
    }

    const cityRef = cityData.Ref;


    fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        apiKey: apiKey,
        modelName: "AddressGeneral",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityRef: cityRef
        }
      })
    })
    .then(response => response.json())
    .then(data => {
      branchSelect.innerHTML = '<option value="">Оберіть відділення Нової Пошти</option>';
      data.data.forEach(branch => {
        const option = document.createElement("option");
        option.value = branch.Description;
        option.textContent = branch.Description;
        branchSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Помилка при отриманні відділень:", error);
      branchSelect.innerHTML = '<option value="">Помилка завантаження відділень</option>';
    });
  })
  .catch(error => {
    console.error("Помилка при отриманні міста:", error);
    branchSelect.innerHTML = '<option value="">Помилка завантаження міста</option>';
  });
});


const cart = [];

function displayProducts() {
  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>${product.price} ₴</p>
      <button onclick='addToCart(${JSON.stringify(product)})'>Додати в кошик</button>
    `;
    productsContainer.appendChild(productCard);
  });
}

document.getElementById('search').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );

  displayFilteredProducts(filteredProducts);
});

function displayFilteredProducts(filtered) {
  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML = '';

  filtered.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>${product.price} ₴</p>
      <button onclick="addToCart(${JSON.stringify(product)})">Додати в кошик</button>
    `;
    productsContainer.appendChild(productCard);
  });
}

function addToCart(product) {
  cart.push(product);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  let totalPrice = 0;

  cart.forEach((product, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${product.name} - ${product.price} ₴
      <button onclick="removeFromCart(${index})">🗑 Видалити</button>
    `;
    cartItems.appendChild(li);
    totalPrice += product.price;
  });

  document.getElementById('total-price').textContent = `Загальна сума: ${totalPrice} ₴`;
}

function removeFromCart(index) {
  cart.splice(index, 1); // Видаляє 1 елемент на позиції index
  updateCart(); // Оновлює вивід
}

function checkout() {
  alert('Замовлення прийнято! Ми з вами зв’яжемось.');
}

const categoryButton = document.getElementById('category-button');
const dropdown = document.querySelector('.dropdown');

categoryButton.addEventListener('click', () => {
  dropdown.classList.toggle('show');
});


window.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});


function addToCartConfigurator() {
  const config = {
    name: "Індивідуальний ПК",
    price: 25000,
    description: "Зібрано через конфігуратор",
    img: "images/configurator.jpg"
  };
  cart.push(config);
  updateCart();
}

document.getElementById('filter').addEventListener('change', function () {
  const selected = this.value;
  document.getElementById('configurator').classList.toggle('hidden', selected !== 'Конфігуратор');
  displayProducts(selected);
});

const novaPoshtaData = {
  "Київ": ["Відділення №1", "Відділення №2", "Відділення №3"],
  "Львів": ["Відділення №1", "Відділення №4", "Відділення №5"],
  "Одеса": ["Відділення №2", "Відділення №3", "Відділення №6"],
  "Харків": ["Відділення №1", "Відділення №7", "Відділення №8"],
  "Миколаїв": ["Відділення №2", "Відділення №9", "Відділення №10"]
};

document.getElementById("delivery-location").addEventListener("change", function () {
  const city = this.value;
  const branchSelect = document.getElementById("nova-poshta-branches");

  branchSelect.innerHTML = '<option value="">Оберіть відділення Нової Пошти</option>';

  if (novaPoshtaData[city]) {
    novaPoshtaData[city].forEach(branch => {
      const option = document.createElement("option");
      option.value = branch;
      option.textContent = branch;
      branchSelect.appendChild(option);
    });
  }
});


function displayProducts(filter = "Всі") {
  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML = '';

  products
    .filter(p => filter === "Всі" || p.category === filter)
    .forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>${product.price} ₴</p>
        <button onclick='addToCart(${JSON.stringify(product)})'>Додати в кошик</button>
      `;
      productsContainer.appendChild(productCard);
    });
}

displayProducts();
