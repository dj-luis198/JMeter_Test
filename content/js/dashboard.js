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

    var data = {"OkPercent": 85.47008547008546, "KoPercent": 14.52991452991453};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.725, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-8"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books-7"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-5"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-10"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book="], "isController": false}, {"data": [0.45, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-3"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 351, 51, 14.52991452991453, 7246.632478632483, 10, 120109, 98.0, 60087.0, 60264.0, 120087.96, 1.467980460385439, 246.0463358452284, 1.2085075296732801], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 8, 8, 100.0, 144462.5, 61665, 182564, 151937.0, 182564.0, 182564.0, 182564.0, 0.03884702043353275, 66.43953931682658, 0.45753842364860925], "isController": true}, {"data": ["https://demoqa.com/books", 8, 0, 0.0, 1270.375, 1101, 1833, 1180.5, 1833.0, 1833.0, 1833.0, 0.2056238112373413, 323.40084815806046, 1.1465937130519714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 10, 10, 100.0, 60386.100000000006, 60346, 60643, 60360.5, 60615.6, 60643.0, 60643.0, 0.08693686644758576, 0.06375936201380558, 0.03922346904178186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-10", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 1142.4830613938052, 0.718738477138643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 10, 10, 100.0, 30262.9, 256, 60271, 30262.5, 60270.6, 60271.0, 60271.0, 0.09625843464533579, 0.06989076773321012, 0.044275119841751136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-9", 9, 0, 0.0, 67.44444444444444, 37, 251, 40.0, 251.0, 251.0, 251.0, 0.05991372423709858, 0.10543411237817542, 0.025861197375778876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-4", 9, 0, 0.0, 82.55555555555556, 59, 120, 71.0, 120.0, 120.0, 120.0, 0.05991212887764612, 8.798989346874585, 0.02679663576754094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 55.22222222222222, 47, 84, 50.0, 84.0, 84.0, 84.0, 0.05991930866433204, 9.388138556743586, 0.025571033092102635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 36.888888888888886, 35, 43, 35.0, 43.0, 43.0, 43.0, 0.05992569214174424, 14.861981299438696, 0.024286291248851424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 27.666666666666668, 25, 35, 26.0, 35.0, 35.0, 35.0, 0.05992928344553427, 5.271026282736371, 0.02387807387283006], "isController": false}, {"data": ["addBook", 1, 1, 100.0, 61265.0, 61265, 61265, 61265.0, 61265.0, 61265.0, 61265.0, 0.01632253325716151, 25.71012583652983, 0.11033649922467967], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-8", 9, 0, 0.0, 438.22222222222223, 424, 446, 443.0, 446.0, 446.0, 446.0, 0.059765718383934976, 3.2160259906167825, 0.022879064068850107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-7", 9, 0, 0.0, 260.6666666666667, 256, 269, 258.0, 269.0, 269.0, 269.0, 0.05984002765939056, 0.03891939298940831, 0.023082823169393817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-6", 9, 0, 0.0, 43.77777777777778, 38, 59, 43.0, 59.0, 59.0, 59.0, 0.05992289920302544, 0.08296616686529998, 0.023582937869940673], "isController": false}, {"data": ["https://demoqa.com/books-10", 8, 0, 0.0, 778.125, 681, 1025, 746.0, 1025.0, 1025.0, 1025.0, 0.2085179586091852, 161.51874380962312, 0.10161177865818694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-5", 9, 0, 0.0, 72.77777777777777, 57, 93, 68.0, 93.0, 93.0, 93.0, 0.05991292654675205, 5.8461845347261985, 0.024105591540294773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-8", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 121.46850310383748, 1.097806151241535], "isController": false}, {"data": ["https://demoqa.com/books-0", 8, 0, 0.0, 411.875, 345, 746, 366.5, 746.0, 746.0, 746.0, 0.21019995270501063, 0.7053193725531413, 0.10161032870017606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-9", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 46.309621710526315, 14.083059210526317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-6", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 25.1953125, 9.037642045454545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-7", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 2.4268306902985075, 1.8255888526119401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 208.77777777777777, 88, 274, 269.0, 274.0, 274.0, 274.0, 0.05990415335463259, 0.20100651457667731, 0.023400059904153354], "isController": false}, {"data": ["https://demoqa.com/books-3", 8, 0, 0.0, 65.5, 54, 87, 60.5, 87.0, 87.0, 87.0, 0.2122635251664942, 33.25821194512988, 0.11255770914590464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-4", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 1836.95068359375, 6.884765625], "isController": false}, {"data": ["https://demoqa.com/books-4", 8, 0, 0.0, 86.75, 64, 103, 88.0, 103.0, 103.0, 103.0, 0.21226915729144555, 31.17988277104118, 0.11691387178942898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-5", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 1254.0064102564102, 6.485376602564102], "isController": false}, {"data": ["https://demoqa.com/books-1", 8, 0, 0.0, 37.25, 26, 65, 28.5, 65.0, 65.0, 65.0, 0.21248339973439576, 18.688812458499335, 0.10665670650730412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 41.0, 24.390243902439025, 6048.947217987805, 12.409489329268292], "isController": false}, {"data": ["https://demoqa.com/books-2", 8, 0, 0.0, 54.0, 36, 83, 50.5, 83.0, 83.0, 83.0, 0.21235931195582927, 52.666561040029734, 0.10804609524315142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 2956.2205188679245, 10.005159198113208], "isController": false}, {"data": ["https://demoqa.com/books-7", 8, 0, 0.0, 293.375, 100, 589, 264.0, 589.0, 589.0, 589.0, 0.21133829978337823, 0.13745244888254873, 0.10339891424948487], "isController": false}, {"data": ["https://demoqa.com/books-8", 8, 0, 0.0, 503.0, 424, 765, 449.0, 765.0, 765.0, 765.0, 0.21023309594512918, 11.312757864031745, 0.10224226736393978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 10, 10, 100.0, 54106.4, 88, 120089, 60087.5, 120088.8, 120089.0, 120089.0, 0.053125365236886005, 0.03833949698247925, 0.01866132214424599], "isController": false}, {"data": ["https://demoqa.com/books-5", 8, 0, 0.0, 89.37500000000001, 65, 122, 90.0, 122.0, 122.0, 122.0, 0.21213406873143825, 20.721396703966906, 0.10731000742469239], "isController": false}, {"data": ["https://demoqa.com/books-6", 8, 0, 0.0, 110.0, 45, 516, 51.5, 516.0, 516.0, 516.0, 0.21231985986889249, 0.2942205870644125, 0.10553789909498659], "isController": false}, {"data": ["https://demoqa.com/books-9", 8, 0, 0.0, 49.75, 37, 77, 50.0, 77.0, 77.0, 77.0, 0.21252291262651754, 0.37399051616502405, 0.11373296496028477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 10, 10, 100.0, 36173.4, 85, 60267, 60090.0, 60266.0, 60267.0, 60267.0, 0.06539366989275437, 0.047576449287209, 0.029567645664399688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 37.282986111111114, 5.577256944444445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 33.0, 30.303030303030305, 2665.2758049242425, 15.210700757575756], "isController": false}, {"data": ["login", 10, 10, 100.0, 67355.3, 444, 121639, 61424.0, 121636.1, 121639.0, 121639.0, 0.06203435462559165, 87.89700411869343, 0.30735478339154226], "isController": true}, {"data": ["https://demoqa.com/books?book=-10", 7, 0, 0.0, 261.2857142857143, 255, 268, 261.0, 268.0, 268.0, 268.0, 0.06246486351427322, 0.016836232744081452, 0.03580749500281092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-10", 9, 0, 0.0, 744.8888888888889, 679, 795, 748.0, 795.0, 795.0, 795.0, 0.05966982695750182, 46.22045773801631, 0.02290062694755685], "isController": false}, {"data": ["https://demoqa.com/books?book=-9", 7, 0, 0.0, 48.285714285714285, 25, 112, 38.0, 112.0, 112.0, 112.0, 0.0625860558267618, 0.11013678964826636, 0.03349331893854049], "isController": false}, {"data": ["https://demoqa.com/books?book=-8", 7, 0, 0.0, 237.14285714285717, 91, 277, 257.0, 277.0, 277.0, 277.0, 0.06247211066488175, 0.016777178157072737, 0.035689633534136546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 8, 8, 100.0, 75092.625, 60088, 120109, 60091.0, 120109.0, 120109.0, 120109.0, 0.04424999032031462, 0.03196672884712182, 0.015167721291435968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 1906.6358901515152, 6.781486742424243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 1, 1, 100.0, 60087.0, 60087, 60087, 60087.0, 60087.0, 60087.0, 60087.0, 0.01664253499092982, 0.011961822024730806, 0.0059159011100570836], "isController": false}, {"data": ["https://demoqa.com/books?book=", 8, 1, 12.5, 510.625, 267, 581, 570.5, 581.0, 581.0, 581.0, 0.07131332400317344, 9.703077852421533, 0.3937292884935952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 1, 10.0, 919.0, 88, 1114, 1015.0, 1113.1, 1114.0, 1114.0, 0.0662238498572876, 93.73687163913962, 0.26770861961351766], "isController": false}, {"data": ["https://demoqa.com/books?book=-5", 7, 0, 0.0, 53.714285714285715, 26, 78, 54.0, 78.0, 78.0, 78.0, 0.06259836886535984, 0.030810134675919303, 0.03618968200028617], "isController": false}, {"data": ["https://demoqa.com/books?book=-4", 7, 0, 0.0, 83.57142857142857, 66, 102, 85.0, 102.0, 102.0, 102.0, 0.06258102007062716, 9.192748494144205, 0.0367122195029279], "isController": false}, {"data": ["https://demoqa.com/books?book=-7", 7, 0, 0.0, 265.7142857142857, 257, 271, 268.0, 271.0, 271.0, 271.0, 0.06247211066488175, 0.016716170236501564, 0.03581164937527889], "isController": false}, {"data": ["https://demoqa.com/books?book=-6", 7, 0, 0.0, 38.57142857142857, 16, 46, 42.0, 46.0, 46.0, 46.0, 0.06260284753523646, 0.037904067843600196, 0.03637567801119697], "isController": false}, {"data": ["https://demoqa.com/books?book=-1", 7, 0, 0.0, 20.71428571428571, 10, 35, 20.0, 35.0, 35.0, 35.0, 0.06260788680494066, 0.0213380395458245, 0.03650088713139606], "isController": false}, {"data": ["https://demoqa.com/books?book=-0", 7, 0, 0.0, 242.57142857142856, 98, 269, 269.0, 269.0, 269.0, 269.0, 0.06257318828272354, 0.209962377870545, 0.03061442122035595], "isController": false}, {"data": ["https://demoqa.com/books?book=-3", 7, 0, 0.0, 36.28571428571429, 18, 42, 40.0, 42.0, 42.0, 42.0, 0.06260620695823271, 0.050317293287720236, 0.036255352271710936], "isController": false}, {"data": ["register", 10, 10, 100.0, 60386.100000000006, 60346, 60643, 60360.5, 60615.6, 60643.0, 60643.0, 0.09229945635620206, 0.06769227707373804, 0.041642918785708354], "isController": true}, {"data": ["https://demoqa.com/books?book=-2", 7, 0, 0.0, 19.28571428571429, 11, 24, 20.0, 24.0, 24.0, 24.0, 0.06261740763932373, 0.021341284439574202, 0.03693448653725735], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 25, 49.01960784313726, 7.122507122507122], "isController": false}, {"data": ["502/Bad Gateway", 26, 50.98039215686274, 7.407407407407407], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 351, 51, "502/Bad Gateway", 26, "504/Gateway Time-out", 25, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 10, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 10, 10, "502/Bad Gateway", 5, "504/Gateway Time-out", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 10, 10, "502/Bad Gateway", 8, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 10, 10, "504/Gateway Time-out", 6, "502/Bad Gateway", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 8, 8, "502/Bad Gateway", 6, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 1, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=", 8, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
