/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.83885890516576, "KoPercent": 3.1611410948342327};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7424042272126816, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40b42ece-147f-4127-845f-aaa0013f2dda"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/752c55e6-56d4-4fa5-839f-c68dbc0738c6"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e0377f7-a0c8-4096-a699-8fe823b95e25"], "isController": false}, {"data": [0.625, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5feac78-3e66-494a-986c-73c0611e1440"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4807eb5-6ed5-4f8f-a75a-7d45f813cfd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2a860670-3b09-4d6f-9236-2be92050220b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/f4807eb5-6ed5-4f8f-a75a-7d45f813cfd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bbe15deb-c550-46ef-af17-d6f4e3ce3e40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5bb8fe8b-db4b-4171-9209-cca2f1c93bcb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e5881ca-0e48-45b7-be44-696829c44b84"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/280e8d40-d22a-42a7-a11e-d1d36f1da159"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.17857142857142858, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a03e008d-0a6b-4c0d-a79f-f38e53dbd13e"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e0377f7-a0c8-4096-a699-8fe823b95e25"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.330188679245283, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=752c55e6-56d4-4fa5-839f-c68dbc0738c6"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40b42ece-147f-4127-845f-aaa0013f2dda"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a860670-3b09-4d6f-9236-2be92050220b"], "isController": false}, {"data": [0.20491803278688525, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40945422-520e-4023-9aa0-074dd1fa4bdb"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4811320754716981, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40945422-520e-4023-9aa0-074dd1fa4bdb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbe15deb-c550-46ef-af17-d6f4e3ce3e40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bb8fe8b-db4b-4171-9209-cca2f1c93bcb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c5feac78-3e66-494a-986c-73c0611e1440"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a03e008d-0a6b-4c0d-a79f-f38e53dbd13e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbaad014-9c6c-43b5-a4aa-27c3e839450e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83c7ec5e-f631-465b-a485-330c2f4c64c2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9e5881ca-0e48-45b7-be44-696829c44b84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 41, 3.1611410948342327, 406.4834232845026, 113, 2406, 128.0, 1131.8000000000004, 1397.1, 1926.1599999999999, 5.1292597177127535, 703.5086030713766, 3.7519429060894636], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1936.3773584905666, 1562, 2538, 1886.0, 2436.6, 2474.5, 2538.0, 0.2535387794738831, 305.09159611631213, 1.2466481979013686], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40b42ece-147f-4127-845f-aaa0013f2dda", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/752c55e6-56d4-4fa5-839f-c68dbc0738c6", 3, 0, 0.0, 389.0, 246, 519, 402.0, 519.0, 519.0, 519.0, 0.043834655678779644, 0.028181459949736264, 0.028110114481509085], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 671.4, 120, 1945, 547.0, 1469.8000000000002, 1945.0, 1945.0, 0.07692741641836207, 0.015655931232018215, 0.05155038393191411], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 671.4, 120, 1945, 547.0, 1469.8000000000002, 1945.0, 1945.0, 0.0772514948164247, 0.015721886249748934, 0.05176755443655335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 191.6875, 116, 364, 119.5, 357.0, 364.0, 364.0, 0.09877762686751451, 0.03570319252376837, 0.055815629244351156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 148.375, 115, 358, 119.0, 348.90000000000003, 358.0, 358.0, 0.09892114130266778, 0.07351463723762713, 0.04965377600544066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 212.87499999999997, 113, 977, 117.0, 535.3000000000004, 977.0, 977.0, 0.09892175289346128, 1.8428885886029776, 0.05772045640023741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 233.375, 115, 1034, 118.5, 560.8000000000004, 1034.0, 1034.0, 0.09878128588538901, 5.580184020660724, 0.057542028350229056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e0377f7-a0c8-4096-a699-8fe823b95e25", 3, 0, 0.0, 412.6666666666667, 269, 507, 462.0, 507.0, 507.0, 507.0, 0.05498332172574319, 0.03534897799750743, 0.03525948691396943], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 439.50000000000006, 116, 2050, 228.5, 1971.6000000000001, 2050.0, 2050.0, 0.07869445892641085, 0.11641342779537472, 0.05085552558061755], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5feac78-3e66-494a-986c-73c0611e1440", 1, 0, 0.0, 1259.0, 1259, 1259, 1259.0, 1259.0, 1259.0, 1259.0, 0.7942811755361397, 0.14349806393963463, 0.5476196386020652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 134.23529411764707, 116, 354, 119.0, 174.79999999999984, 354.0, 354.0, 0.12079783416589096, 0.08977260917992483, 0.06063485035280074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 146.17647058823533, 116, 358, 118.0, 353.2, 358.0, 358.0, 0.12079869253179848, 0.04299567434093655, 0.06829622770553542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 846.1428571428571, 679, 1129, 830.0, 1129.0, 1129.0, 1129.0, 0.04261640366257549, 12.530637674575054, 0.024304667713812584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1207.857142857143, 804, 1415, 1255.0, 1415.0, 1415.0, 1415.0, 0.04243787398376448, 38.18567360841664, 0.02416140677005341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 218.85714285714283, 115, 355, 124.0, 355.0, 355.0, 355.0, 0.04270870830562352, 0.07557439399393535, 0.02364827891532083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4807eb5-6ed5-4f8f-a75a-7d45f813cfd5", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 0.6452287946428571, 2.462332589285714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 118.85714285714286, 116, 123, 118.0, 122.5, 123.0, 123.0, 0.06623675856228385, 0.04922477857997852, 0.033247747950208885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 185.7142857142857, 114, 360, 120.0, 358.5, 360.0, 360.0, 0.06616319624949195, 0.01770382399644609, 0.03773369786103838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 169.14285714285714, 115, 367, 118.0, 363.5, 367.0, 367.0, 0.06616632323194133, 0.017833891808609184, 0.038898561118778006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 151.21428571428572, 114, 359, 117.5, 355.5, 359.0, 359.0, 0.06623895228902893, 0.01785346760915233, 0.039005945537387156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 117.99999999999999, 117, 120, 118.0, 120.0, 120.0, 120.0, 0.04277029297650689, 0.031785344682736076, 0.024016521935050255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 241.11764705882354, 115, 1064, 119.0, 496.7999999999995, 1064.0, 1064.0, 0.1206015891032917, 6.41397742489004, 0.0702908848254824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 789.5, 116, 1522, 1081.5, 1503.1000000000001, 1522.0, 1522.0, 0.09327923137913344, 46.64051649811628, 0.05038455010908488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 200.88235294117644, 116, 586, 121.0, 401.99999999999983, 586.0, 586.0, 0.120598166907863, 2.1164673471595585, 0.07040666189594506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 595.5555555555557, 116, 1154, 792.5, 1072.1000000000001, 1154.0, 1154.0, 0.09328164839037334, 15.248897624686471, 0.050476951011587654], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 457.21428571428567, 119, 1259, 436.5, 1019.5, 1259.0, 1259.0, 0.07354872603099553, 0.015088365182558445, 0.04958485191752036], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2a860670-3b09-4d6f-9236-2be92050220b", 3, 0, 0.0, 668.0, 228, 1098, 678.0, 1098.0, 1098.0, 1098.0, 0.03316786255237758, 0.02765068229057259, 0.02126975560813276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 341.0, 235, 483, 244.0, 482.0, 483.0, 483.0, 0.0661250708482902, 0.10248094476194974, 0.14871683414415265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 767.0, 255, 1867, 588.0, 1632.6000000000001, 1849.3999999999996, 1867.0, 0.0886146990687017, 0.0544322712052865, 0.040066997723446185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4807eb5-6ed5-4f8f-a75a-7d45f813cfd5", 3, 0, 0.0, 1387.6666666666667, 1095, 1938, 1130.0, 1938.0, 1938.0, 1938.0, 0.07203745947892905, 0.03259507443870813, 0.04619589686637051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 120.33333333333333, 115, 134, 119.0, 127.70000000000002, 134.0, 134.0, 0.09327874799191584, 0.0693214133025859, 0.04682155905062963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 183.83333333333334, 116, 357, 120.0, 356.1, 357.0, 357.0, 0.09328213180765224, 0.10279658535574178, 0.048847609386255396], "isController": false}, {"data": ["login", 21, 0, 0.0, 2924.5714285714294, 1855, 5217, 2685.0, 4477.8, 5144.699999999999, 5217.0, 0.0865700929185664, 34.6390556916229, 0.1784662755381774], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bbe15deb-c550-46ef-af17-d6f4e3ce3e40", 3, 0, 0.0, 398.6666666666667, 292, 550, 354.0, 550.0, 550.0, 550.0, 0.024899158408445796, 0.024972105161595537, 0.015967233744999417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 127.94117647058823, 120, 155, 126.0, 141.39999999999998, 155.0, 155.0, 0.12783588879781627, 0.10349214044276336, 0.04544166359609875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 924.4999999999999, 238, 1644, 1206.0, 1625.1000000000001, 1644.0, 1644.0, 0.09321691576298045, 62.019673947943524, 0.19639679398543744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bb8fe8b-db4b-4171-9209-cca2f1c93bcb", 3, 0, 0.0, 323.6666666666667, 229, 506, 236.0, 506.0, 506.0, 506.0, 0.02929172606377785, 0.029568243009041376, 0.01878408214376379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e5881ca-0e48-45b7-be44-696829c44b84", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 0.7002483042635659, 2.672298934108527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/280e8d40-d22a-42a7-a11e-d1d36f1da159", 2, 0, 0.0, 1171.0, 292, 2050, 1171.0, 2050.0, 2050.0, 2050.0, 0.03844970778222086, 0.03398143119424792, 0.023899647464241773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 427.375, 236, 1152, 358.0, 842.6000000000004, 1152.0, 1152.0, 0.0987051123079106, 7.523764653467943, 0.22041169671003524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 724.7142857142856, 116, 1533, 538.0, 1527.0, 1533.0, 1533.0, 0.08481455902487489, 50.745196712981475, 0.12361887631311112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a03e008d-0a6b-4c0d-a79f-f38e53dbd13e", 3, 0, 0.0, 367.0, 226, 453, 422.0, 453.0, 453.0, 453.0, 0.017396649405324534, 0.023982685622249155, 0.011156054468909288], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1094.5652173913045, 156, 1978, 1099.0, 1810.8000000000004, 1967.6, 1978.0, 0.09592726211081684, 0.029781765478697892, 0.04327968271015369], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e0377f7-a0c8-4096-a699-8fe823b95e25", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 392.8823529411764, 234, 1183, 250.0, 802.1999999999997, 1183.0, 1183.0, 0.12049559127895437, 8.655443078237079, 0.26918388380326613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 143.30769230769232, 118, 354, 123.0, 272.79999999999995, 354.0, 354.0, 0.08932743314185197, 0.06935088803493389, 0.03175311099964269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 351.80000000000007, 234, 711, 242.5, 591.8000000000002, 705.5999999999999, 711.0, 0.11352412955373664, 0.17594022812673832, 0.25531842808814015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 118.64285714285715, 116, 121, 118.0, 121.0, 121.0, 121.0, 0.11628872829969267, 0.08642160374615832, 0.05837149057230667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 153.2142857142857, 116, 368, 118.5, 364.0, 368.0, 368.0, 0.11629355816754579, 0.03111761224405034, 0.06632366989242845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 149.99999999999997, 115, 348, 117.5, 346.5, 348.0, 348.0, 0.11629355816754579, 0.031344748099846324, 0.06836789259459235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 134.57142857142856, 115, 358, 117.0, 240.0, 358.0, 358.0, 0.11628776237426386, 0.031343185952438304, 0.06847804757000107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 128.33333333333334, 119, 137, 129.0, 137.0, 137.0, 137.0, 0.03933085111961823, 0.011599528357543657, 0.02431291870968588], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1331.1132075471698, 912, 2035, 1181.0, 1942.6000000000001, 1990.8999999999999, 2035.0, 0.25341997427548185, 303.178392271408, 0.5004054570166253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1094.5652173913045, 156, 1978, 1099.0, 1810.8000000000004, 1967.6, 1978.0, 0.09575593062274661, 0.02972857356969783, 0.04320238276143451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 117.0, 116, 118, 117.0, 118.0, 118.0, 118.0, 0.03345600535296086, 0.00901743894279023, 0.019701143777183003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 121.0, 121, 121, 121.0, 121.0, 121.0, 121.0, 0.033453207326252406, 0.00901668478715397, 0.019666826963285106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 332.3076923076923, 115, 1278, 121.0, 1188.0, 1278.0, 1278.0, 0.08972138060499817, 12.440686295231654, 0.051560138343467246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 330.0, 115, 1041, 124.0, 1033.8, 1041.0, 1041.0, 0.08986465001175153, 4.085601263635232, 0.05173022934495582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 118.5, 115, 122, 118.5, 122.0, 122.0, 122.0, 0.03345656501446996, 0.008952244935512471, 0.0190806972348149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 119.0, 116, 122, 119.0, 121.6, 122.0, 122.0, 0.08986340762041697, 0.06678325507728254, 0.045107218278217114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 122.5, 121, 124, 122.5, 124.0, 124.0, 124.0, 0.03345040976751965, 0.024859142415119585, 0.016790537715337013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 153.15384615384613, 113, 352, 118.0, 350.0, 352.0, 352.0, 0.08986465001175153, 0.04481081330964593, 0.05008982144585309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 239.5, 123, 356, 239.5, 356.0, 356.0, 356.0, 0.0323807981866753, 0.02548722982271513, 0.011510361855419735], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 512.0, 116, 1095, 513.0, 1020.5, 1095.0, 1095.0, 0.07496051187320965, 0.014938768305089285, 0.051007240047653474], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=752c55e6-56d4-4fa5-839f-c68dbc0738c6", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1404.3809523809523, 935, 2406, 1326.0, 1961.2000000000003, 2365.8999999999996, 2406.0, 0.08741986512363667, 0.04524660987844476, 0.04020972311839147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 245.0, 242, 248, 245.0, 248.0, 248.0, 248.0, 0.033382851229323496, 0.05173689931732069, 0.07507881482532423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40b42ece-147f-4127-845f-aaa0013f2dda", 3, 0, 0.0, 529.3333333333334, 239, 946, 403.0, 946.0, 946.0, 946.0, 0.10346254655814596, 0.04681410798041109, 0.06634805231756105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a860670-3b09-4d6f-9236-2be92050220b", 1, 0, 0.0, 780.0, 780, 780, 780.0, 780.0, 780.0, 780.0, 1.2820512820512822, 0.23162059294871795, 0.8839142628205128], "isController": false}, {"data": ["addBook", 61, 19, 31.147540983606557, 1190.3114754098356, 591, 2649, 1019.0, 2039.8000000000002, 2460.4, 2649.0, 0.28466761555871856, 79.27638079106097, 1.0353335292367642], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/40945422-520e-4023-9aa0-074dd1fa4bdb", 3, 0, 0.0, 332.0, 219, 451, 326.0, 451.0, 451.0, 451.0, 0.023109632094657055, 0.027314802778548097, 0.014819653394034633], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 208.8867924528302, 115, 658, 122.0, 476.40000000000003, 488.4, 658.0, 0.25439796481628146, 0.1890594250245998, 0.12297557869537043], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 743.3584905660377, 567, 1057, 698.0, 937.2, 978.3999999999997, 1057.0, 0.25427469343107717, 74.76520258316701, 0.12788229210644994], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 194.8490566037736, 114, 360, 122.0, 356.6, 358.0, 360.0, 0.25489224790916215, 0.4510397980580096, 0.12396126900269801], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1120.584905660377, 785, 1624, 1061.0, 1490.6, 1515.7999999999997, 1624.0, 0.25406260486074494, 228.60597844812088, 0.1275275184554911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 148.35, 118, 363, 124.5, 334.00000000000045, 362.65, 363.0, 0.1170487332400845, 0.08744363371939907, 0.04160716689393629], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 19, 10.857142857142858, 202.33142857142855, 116, 1934, 125.0, 377.0, 549.1999999999999, 1245.4400000000082, 0.7422519500019086, 1.5453213407509045, 0.35828567899087665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 146.1428571428571, 117, 422, 122.5, 282.0, 422.0, 422.0, 0.12351342767406571, 0.09565053529837315, 0.043905163743515545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 125.9375, 119, 148, 123.5, 141.0, 148.0, 148.0, 0.09934741168946483, 0.08062275304096218, 0.03531490024898945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40945422-520e-4023-9aa0-074dd1fa4bdb", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbe15deb-c550-46ef-af17-d6f4e3ce3e40", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 306.2857142857143, 236, 485, 241.0, 481.0, 485.0, 485.0, 0.11617003974674932, 0.18004087214657338, 0.26126914212574576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 488.61538461538464, 238, 1399, 462.0, 1307.8, 1399.0, 1399.0, 0.0896483715028515, 16.617657722948604, 0.19809246152016055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bb8fe8b-db4b-4171-9209-cca2f1c93bcb", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5feac78-3e66-494a-986c-73c0611e1440", 3, 0, 0.0, 412.6666666666667, 319, 587, 332.0, 587.0, 587.0, 587.0, 0.028162138820569626, 0.023477616380038677, 0.01805970490772206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 122.78571428571426, 118, 142, 122.0, 133.5, 142.0, 142.0, 0.06634190723505885, 0.05500417894781735, 0.023582474837462328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a03e008d-0a6b-4c0d-a79f-f38e53dbd13e", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 162.1111111111111, 118, 373, 121.0, 360.40000000000003, 373.0, 373.0, 0.09532636038660136, 0.07400825830795711, 0.033885542168674704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbaad014-9c6c-43b5-a4aa-27c3e839450e", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 131.05, 117, 350, 119.0, 127.7, 338.89999999999986, 350.0, 0.11374558524947251, 0.08453163122543807, 0.05709495197092663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 152.64999999999998, 115, 355, 119.0, 345.6, 354.55, 355.0, 0.11360279917297161, 0.030397623997455298, 0.06478909640333538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 177.1, 114, 362, 118.5, 361.8, 362.0, 362.0, 0.11374687907000551, 0.030658338499337422, 0.06687072382826496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83c7ec5e-f631-465b-a485-330c2f4c64c2", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e5881ca-0e48-45b7-be44-696829c44b84", 3, 0, 0.0, 456.6666666666667, 223, 627, 520.0, 627.0, 627.0, 627.0, 0.0688626190749455, 0.03115854183404109, 0.04415994777918054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 182.85, 114, 485, 120.0, 357.20000000000005, 478.6499999999999, 485.0, 0.11360473504535669, 0.030620026242693794, 0.06689810081284188], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 21.951219512195124, 0.6939090208172706], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.75609756097561, 0.3084040092521203], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.317073170731708, 0.2313030069390902], "isController": false}, {"data": ["401/Unauthorized", 25, 60.97560975609756, 1.9275250578257517], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 41, "401/Unauthorized", 25, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
