class Vk_Funcs
{ 
     constructor()
     {
         this.crypto = require('crypto');
     }
     verifyLaunchParams = (sign,queryParams, secretKey)  => {    
        /**
         * Функция, котрая обрабатывает входящий query-параметр. В случае передачи
         * параметра, отвечающего за подпись, подменяет "sign". В случае встречи
         * корректного в контексте подписи параметра добавляет его в массив
         * известных параметров.
         * @param key
         * @param value
         */
        if (!sign || queryParams.length === 0) {
            return false;
        }
        // Снова создаём запрос в виде строки из уже отфильтрованных параметров.
        const queryString = queryParams
            // Сортируем ключи в порядке возрастания.
            .sort((a, b) => a.key.localeCompare(b.key))
            // Воссоздаём новый запрос в виде строки.
            .reduce((acc, {key, value}, idx) => {
                return acc + (idx === 0 ? '' : '&') + `${key}=${encodeURIComponent(value)}`;
            }, '');
    
        // Создаём хеш получившейся строки на основе секретного ключа.
        const paramsHash = this.crypto
            .createHmac('sha256', secretKey)
            .update(queryString)
            .digest()
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=$/, '');
    
        return paramsHash === sign;
    }
}
module.exports = 
{
    Vk_Funcs
}
