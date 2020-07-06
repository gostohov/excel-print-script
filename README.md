# excel-print-script
Скрипт для чтения excel-файлов и превращения его содержимого в sql-инсерт запрос

# Запрос
```sql
insert into IN_CITEM (
  IN_ITEMID,
  STATUS,
  GTIN,
  EXTART,
  NAME, 
  USERCRE, 
  DATCRE, 
  TNVED10, 
  articul,
  brand,
  inn
) values (
  next value FOR IN_CITEM_SEQ, 
  0, 
  gtin, 
  extart, 
  name,
  'Ann', 
  GETDATE(), 
  tnved10, 
  articul, 
  'Faberlic',
  5001026970
);
GO
```

# Инструкция и Требования:
## Что надо установить:
- nodejs
- python
- установленный xlrd через pip
- после установки среды, запустить в данной директории команду `npm install`

## Запуск скрипта:
- В терминале перейти в директорию скрипта
- Ввести команду: `node index.js ../left ~/Downloads/left.xlsx -o ./merger-test.text`
  - `../left` и `~/Downloads/left.xlsx` - пути к папкам с excel-файлами. Папок может быть сколько угодно, главное написать пути к ним последовательно. Можно прописать как названия конкретных файлов, так и названия папок с n-количеством файлов.
  - `-o ./merger-test.text` - после флага `-o` указывается путь к файлу, в который будет записан результат отработки скрипта

## Установка среды на Windows
- https://nodejs.org/dist/v12.18.1/node-v12.18.1-x86.msi
- https://www.python.org/ftp/python/3.8.3/python-3.8.3-amd64.exe

  Необходимо расставить галочка как на картинках и нажать **Install**
  ![](https://i.imgur.com/IiNVYMT.png)
  ![](https://i.imgur.com/XGK8riW.png)
- Установить пакет **xlrd** с помощью команды
  ![](https://i.imgur.com/a4esFR8.png)