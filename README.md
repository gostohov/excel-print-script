# excel-print-script
Скрипт для чтения excel-файлов и превращения его содержимого в sql-инсерт запрос

# Инструкция и Требования:
## Что надо установить:
- nodejs
- python
- установленный xlrd через pip


## Пример того как **НАДО** расположить файлы:
- **merger** - папка с файлами скрипта
- **left** - эксельки которые надо в Маркировки остатков
- **import** - эксельки которые надов Импорт
  
![](https://i.imgur.com/14UmkPA.png)

## Запуск скрипта:
- В терминале перейти в директорию merger
- Написать команду `node index.js`
- Дождаться завершения работы скрипта
- Результат запишется в файл `merger-log.txt` внутри папки **merger**

![](https://i.imgur.com/HxRTsjx.png)

## Установка среды на Windows
- https://nodejs.org/dist/v12.18.1/node-v12.18.1-x86.msi
- https://www.python.org/ftp/python/3.8.3/python-3.8.3-amd64.exe

  Необходимо расставить галочка как на картинках и нажать **Install**
  ![](https://i.imgur.com/IiNVYMT.png)
  ![](https://i.imgur.com/XGK8riW.png)
- Установить пакет **xlrd** с помощью команды
  ![](https://i.imgur.com/a4esFR8.png)