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

    var data = {"OkPercent": 64.95726495726495, "KoPercent": 35.042735042735046};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5174129353233831, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35294117647058826, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.0, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.0, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-7"], "isController": false}, {"data": [0.0, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.058823529411764705, 500, 1500, "https://demoqa.com/books?book="], "isController": false}, {"data": [0.17857142857142858, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-3"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 351, 123, 35.042735042735046, 5188.427350427353, 19, 120087, 90.0, 1182.8, 60090.0, 60456.0, 1.3960925318993223, 226.73937707450003, 1.0074578213995926], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 17, 17, 100.0, 54341.64705882353, 600, 121956, 61612.0, 120879.2, 121956.0, 121956.0, 0.075181652138918, 91.25821711963611, 0.44254300970948923], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 1, 1, 100.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 2.691947565543071, 1.8799742509363295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 7.986111111111112, 4.969618055555555], "isController": false}, {"data": ["https://demoqa.com/books", 17, 5, 29.41176470588235, 954.4117647058822, 344, 1398, 1156.0, 1306.8, 1398.0, 1398.0, 0.1238038364624146, 137.44218599796818, 0.504908856252822], "isController": false}, {"data": ["deleteBook", 2, 2, 100.0, 89.5, 89, 90, 89.5, 90.0, 90.0, 90.0, 0.016755611035245428, 0.012043095431582652, 0.007723289461558439], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 2, 2, 100.0, 89.5, 89, 90, 89.5, 90.0, 90.0, 90.0, 0.017257893328961334, 0.012404110830190959, 0.007954810206318115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 11, 11, 100.0, 54947.90909090909, 356, 60630, 60365.0, 60603.0, 60630.0, 60630.0, 0.09050592813829306, 0.06625638169641021, 0.040833729296768935], "isController": false}, {"data": ["deleteAccount", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 7.986111111111112, 4.720052083333334], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 11, 11, 100.0, 5700.818181818182, 89, 60257, 266.0, 48258.80000000004, 60257.0, 60257.0, 0.18078724628153506, 0.13018158332648533, 0.08315507128769825], "isController": false}, {"data": ["goToProfile", 2, 2, 100.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 0.01676966033053001, 0.01205319336256844, 0.007254843287524211], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-9", 5, 0, 0.0, 42.2, 37, 48, 40.0, 48.0, 48.0, 48.0, 0.07326973520317698, 0.12893756136340323, 0.03162619429668381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-4", 5, 0, 0.0, 84.6, 60, 118, 67.0, 118.0, 118.0, 118.0, 0.07321608996793134, 10.73665339319969, 0.03274704023956305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 51.6, 48, 58, 51.0, 58.0, 58.0, 58.0, 0.07328047368498189, 11.481676217555071, 0.031273014648766695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 48.6, 34, 67, 47.0, 67.0, 67.0, 67.0, 0.07327080890973035, 18.171661484283412, 0.029694712595252054], "isController": false}, {"data": ["addBook", 6, 6, 100.0, 20410.833333333332, 343, 60534, 358.0, 60534.0, 60534.0, 60534.0, 0.053598227685271206, 0.1540949045951547, 0.0893478268151933], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 32.4, 25, 48, 26.0, 48.0, 48.0, 48.0, 0.0732901410102313, 6.446182820424497, 0.029201540558764037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-8", 5, 0, 0.0, 396.8, 256, 446, 425.0, 446.0, 446.0, 446.0, 0.07283957811316356, 3.919537532413612, 0.027883900996445426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-7", 5, 0, 0.0, 280.8, 256, 359, 261.0, 359.0, 359.0, 359.0, 0.07303748283619153, 0.04750289411025738, 0.028173638398726226], "isController": false}, {"data": ["https://demoqa.com/books-10", 12, 0, 0.0, 758.75, 602, 855, 770.0, 846.6, 855.0, 855.0, 0.08775586318860928, 67.97600014260328, 0.042763843487418005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-6", 5, 0, 0.0, 95.6, 31, 327, 42.0, 327.0, 327.0, 327.0, 0.07299270072992702, 0.10117757755474452, 0.028726619525547444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-5", 5, 0, 0.0, 92.2, 61, 180, 74.0, 180.0, 180.0, 180.0, 0.07314967887290975, 7.139522954369231, 0.029431316109022283], "isController": false}, {"data": ["https://demoqa.com/books-0", 12, 0, 0.0, 363.1666666666667, 345, 470, 349.0, 443.0000000000001, 470.0, 470.0, 0.08787410569790347, 0.294858815603512, 0.042478205391076385], "isController": false}, {"data": ["https://demoqa.com/books-3", 12, 0, 0.0, 67.66666666666667, 47, 104, 58.5, 101.00000000000001, 104.0, 104.0, 0.0881231962283272, 13.807172218428029, 0.0467293901874821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 125.6, 88, 268, 91.0, 268.0, 268.0, 268.0, 0.07324612161786034, 0.24577507214742977, 0.02861176625697669], "isController": false}, {"data": ["https://demoqa.com/books-4", 12, 0, 0.0, 94.25, 60, 134, 95.0, 128.60000000000002, 134.0, 134.0, 0.08811154922131419, 12.919664237633176, 0.048530189219551954], "isController": false}, {"data": ["https://demoqa.com/books-1", 12, 0, 0.0, 39.75, 25, 98, 30.5, 86.30000000000004, 98.0, 98.0, 0.08813743564131002, 7.752048965854088, 0.04424086124964194], "isController": false}, {"data": ["https://demoqa.com/books-2", 12, 0, 0.0, 51.083333333333336, 34, 104, 40.5, 94.70000000000003, 104.0, 104.0, 0.08812902088657794, 21.85659962435005, 0.044839081915924915], "isController": false}, {"data": ["https://demoqa.com/books-7", 12, 0, 0.0, 258.6666666666667, 92, 364, 265.0, 337.0000000000001, 364.0, 364.0, 0.08803656451979722, 0.057258156220883746, 0.0430725769769711], "isController": false}, {"data": ["deleteBooks", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 7.986111111111112, 4.969618055555555], "isController": true}, {"data": ["https://demoqa.com/books-8", 12, 0, 0.0, 466.33333333333337, 429, 538, 449.0, 536.5, 538.0, 538.0, 0.08791337602016147, 4.7306668412724, 0.042754747322305095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 29, 29, 100.0, 26986.44827586207, 85, 60096, 91.0, 60092.0, 60094.0, 60096.0, 0.14084370234383345, 0.10123141105963032, 0.05148839010791542], "isController": false}, {"data": ["https://demoqa.com/books-5", 12, 0, 0.0, 83.74999999999999, 60, 136, 74.5, 130.3, 136.0, 136.0, 0.08811478419220771, 8.599380511763323, 0.044573689659730076], "isController": false}, {"data": ["https://demoqa.com/books-6", 12, 0, 0.0, 82.5, 36, 271, 53.0, 233.20000000000013, 271.0, 271.0, 0.08812902088657794, 0.12215996197599954, 0.043806319952410334], "isController": false}, {"data": ["https://demoqa.com/books-9", 12, 0, 0.0, 48.75, 38, 64, 49.0, 63.7, 64.0, 64.0, 0.08817370219332085, 0.15516505014879312, 0.04718670781439436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 11, 11, 100.0, 5558.90909090909, 85, 60264, 89.0, 48230.000000000044, 60264.0, 60264.0, 0.09936496752572198, 0.07155089236515721, 0.04492771480899343], "isController": false}, {"data": ["login", 11, 11, 100.0, 11717.454545454546, 426, 121662, 450.0, 97594.40000000008, 121662.0, 121662.0, 0.09041442685472868, 64.78949813314757, 0.2845437693158094], "isController": true}, {"data": ["https://demoqa.com/books?book=-10", 2, 0, 0.0, 511.5, 345, 678, 511.5, 678.0, 678.0, 678.0, 0.5975500448162533, 231.5127119435315, 0.31686491634299374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 7.986111111111112, 3.949652777777778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-10", 5, 0, 0.0, 709.8, 531, 823, 721.0, 823.0, 823.0, 823.0, 0.07247427163357009, 56.138825599724605, 0.02781483276561821], "isController": false}, {"data": ["https://demoqa.com/books?book=-9", 2, 0, 0.0, 43.0, 36, 50, 43.0, 50.0, 50.0, 50.0, 0.7404664938911515, 1.3030474824139207, 0.3962652721214365], "isController": false}, {"data": ["https://demoqa.com/books?book=-8", 2, 0, 0.0, 345.5, 267, 424, 345.5, 424.0, 424.0, 424.0, 0.6462035541195477, 17.47305381663974, 0.34171799273021], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 17, 17, 100.0, 14205.411764705881, 85, 120087, 89.0, 72088.59999999996, 120087.0, 120087.0, 0.10267374511544756, 0.07388522547456408, 0.035193832554220796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 5, 5, 100.0, 121.2, 86, 254, 89.0, 254.0, 254.0, 254.0, 0.04010394943694055, 0.02882471365780102, 0.0201303027447143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 5, 5, 100.0, 88.0, 85, 91, 89.0, 91.0, 91.0, 91.0, 0.040813328000391814, 0.02933457950028161, 0.014507862687639275], "isController": false}, {"data": ["https://demoqa.com/books?book=", 17, 15, 88.23529411764706, 267.4117647058824, 85, 828, 255.0, 695.1999999999999, 828.0, 828.0, 0.12753570999879965, 13.038863284063288, 0.14377805082298045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 9, 64.28571428571429, 378.7857142857143, 85, 1141, 90.0, 1055.0, 1141.0, 1141.0, 0.10266413428468765, 57.70262875182413, 0.1897453196154495], "isController": false}, {"data": ["https://demoqa.com/books?book=-5", 2, 0, 0.0, 65.0, 61, 69, 65.0, 69.0, 69.0, 69.0, 0.7363770250368188, 36.00085431240795, 0.400908390095729], "isController": false}, {"data": ["https://demoqa.com/books?book=-4", 2, 0, 0.0, 115.0, 114, 116, 115.0, 116.0, 116.0, 116.0, 0.7220216606498194, 105.86677854241877, 0.4103677797833935], "isController": false}, {"data": ["https://demoqa.com/books?book=-7", 2, 0, 0.0, 308.0, 268, 348, 308.0, 348.0, 348.0, 348.0, 0.6823609689525759, 0.31319302285909245, 0.36250426475605596], "isController": false}, {"data": ["https://demoqa.com/books?book=-6", 2, 0, 0.0, 44.0, 41, 47, 44.0, 47.0, 47.0, 47.0, 0.7415647015202076, 0.7383058722654802, 0.39974972191323693], "isController": false}, {"data": ["https://demoqa.com/books?book=-1", 2, 0, 0.0, 23.0, 19, 27, 23.0, 27.0, 27.0, 27.0, 0.7457121551081282, 32.921298238255034, 0.40453427945563014], "isController": false}, {"data": ["https://demoqa.com/books?book=-0", 2, 0, 0.0, 178.0, 88, 268, 178.0, 268.0, 268.0, 268.0, 0.6839945280437756, 2.295122264021888, 0.3346496665526676], "isController": false}, {"data": ["https://demoqa.com/books?book=-3", 2, 0, 0.0, 55.5, 46, 65, 55.5, 65.0, 65.0, 65.0, 0.7352941176470588, 57.89830824908088, 0.4078584558823529], "isController": false}, {"data": ["register", 11, 11, 100.0, 54947.90909090909, 356, 60630, 60365.0, 60603.0, 60630.0, 60630.0, 0.09650646593321752, 0.07064917596638065, 0.04354100318471338], "isController": true}, {"data": ["https://demoqa.com/books?book=-2", 2, 0, 0.0, 27.5, 20, 35, 27.5, 35.0, 35.0, 35.0, 0.7432181345224824, 92.28824089557786, 0.4082619147157191], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 13, 10.56910569105691, 3.7037037037037037], "isController": false}, {"data": ["502/Bad Gateway", 110, 89.4308943089431, 31.33903133903134], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 351, 123, "502/Bad Gateway", 110, "504/Gateway Time-out", 13, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 1, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 17, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 11, 11, "504/Gateway Time-out", 10, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 11, 11, "502/Bad Gateway", 10, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 29, 29, "502/Bad Gateway", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 11, 11, "502/Bad Gateway", 10, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 1, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 17, 17, "502/Bad Gateway", 16, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 5, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 5, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=", 17, 15, "502/Bad Gateway", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
