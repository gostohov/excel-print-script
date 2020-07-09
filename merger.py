#/usr/bin/python3
import xlrd 
import os
import sys
import json

pathList = sys.argv[1:]
refScheme = [
  'mark'
]

def calculateInsertQuery(headers, row, pathIndex):
  orderRow = {}

  for idx, colName in enumerate(refScheme):
    if colName not in headers:
      orderRow[idx] = 0
    else:
      hIndex = headers.index(colName)
      colValue = row[hIndex]
      orderRow[idx] = colValue

  orderRow['pathIndex'] = pathIndex

  return orderRow

def processFile(fullFileName, pathIndex):
  wb = xlrd.open_workbook(fullFileName, on_demand=True)
  sheetCount = len(wb.sheet_names())
  for sheetIndex in range(sheetCount):
    sheet = wb.sheet_by_index(sheetIndex)

    headers = sheet.row_values(0)
    for i in range(sheet.nrows):
      if i !=0:
        rowValues = sheet.row_values(i)
        query = calculateInsertQuery(headers, rowValues, pathIndex)
        print (json.dumps(query))


# MAIN
for pathIndex, path in enumerate(pathList):
  if os.path.isdir(path):  
    for idx, file in enumerate(os.listdir(path)):
        fullFileName = os.path.join(path, file)
        processFile(fullFileName, pathIndex)
  elif os.path.isfile(path):  
      processFile(path, pathIndex)


  