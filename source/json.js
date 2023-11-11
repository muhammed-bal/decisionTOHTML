const data ={
    "id": 1,
    "question": "Merhaba kaç yaşındasın",
    "type": "input",
    "inputType": "int",
    "value": "Yaşınızı giriniz. Yalnızca rakamla.", // input=>placeholder
    "input": [
        {
            "value": 100,
            "comparison": "bigger-equal",
            "return": {
                "id": 11,
                "question": "Hangi Hayvanları Seversin?",
                "type": "checkbox",
                "value": ["Aslan", "Kaplan", "Timsah", "Kedi"],
                "checkbox": [
                    {
                        "ischecked": ["Aslan", "Kaplan", "Kedi"],
                        "return": {
                            "id": 111,
                            "question": "Demek Kedigilleri seviyorsun",
                            "type": "option",
                            "value": ["Evet", "Hayır"],
                            "option": [
                                {
                                    "ischecked": "Evet",
                                    "return": null,
                                },
                                {
                                    "ischecked": "Hayır",
                                    "return": 1
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            "value": [18,100],
            "comparison": ["equal",null],
            "return": {
                "id": 12,
                "question": "Hangi hayvanları seversin?",
                "type": "checkbox",
                "value": ["Aslan", "Kaplan", "Kedi"],
                "checkbox": [
                    {
                        "ischecked": "all",
                        "return":111
                    }
                ]
            }
        },
        {
            "value": 10,
            "comparison": "smaller",
            "return": {
                "id": 13,
                "question": "Para mı Şeker mi?",
                "type": "input",
                "inputType": "str",
                "value": "Cevabın ne?",
                "input": [
                    {
                        "value": "Para",
                        "return": 1
                    },
                    {
                        "value": "Şeker",
                        "return": null
                    }
                ]
            }
        }
    ]

}