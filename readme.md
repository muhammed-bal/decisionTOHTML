# Decision Tree (algorithms) to HTML Components

<p>Bu sınıf algoritma mantığı ya da karar ağacı mantığını HTML elementleri kullanarak görsel hale getirmektedir.</p>

| Component | Desteklenen |
| ------- | ------------------ |
| input[type="text"] |  :white_check_mark: |
| input[type="number"] |  :white_check_mark: |
| input[type="checkbox"] |  :white_check_mark: |
| input[type="radio"] |  :white_check_mark: |
| input[type="date"] |  :x: |
| input[type="number"] |  :x: |

``` js
const data = {
    "id": 1, // spesific
    "question": "What do you want?",
    "type": "input",
    "value": "Write here...", // input=>placeholder
    "input": [
        {
            "value": "x",
            "return": {
                //...
            }
        },
        {
            "value": "y",
            "return": 1 // #id => go to id
        }
    ]
}

const main = document.querySelector('.mainArea');
const newDecision = new DecisionToHTML(data, main);
newDecision.start();
```

<p>
### Ayrıntılı bilgi için örneğe bakın.
</p>