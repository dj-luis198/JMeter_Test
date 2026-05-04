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

    var data = {"OkPercent": 98.74260355029585, "KoPercent": 1.257396449704142};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7723499361430396, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.008620689655172414, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3ae9f8c-2f3c-4703-b2d8-39075e35d64f"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81ef0c89-560c-4bc4-ad33-755b195bfd1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2dd0d60-8f62-46ae-9718-84bd5a1fa676"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e30bee30-1fe1-4d85-9724-dfbdf8c9ca44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7abd938f-4294-4422-9894-d5854a61cc68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21b08166-0c3d-43ab-a7e5-29b771db09ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/035a2233-6a62-4364-8344-1765ebd1e6ec"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=064bb0b7-5f47-45c3-b00d-54554adbfe18"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/664ce384-ecc5-444f-8f24-6ecd66ab8917"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e98f499-e58e-4463-ad4c-5239dcbf432c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a3f4dca-d104-491e-806f-933a2413b066"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9983d275-b57d-4933-b23c-e7b8ffd12a59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ebec0c7-821f-471e-9547-f7a9774c6aec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7df4ed4c-fe2f-42e0-b6e0-e5e42df4b6f4"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fdaae7b8-a983-4663-b6d5-d9ac9c3c7165"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ebec0c7-821f-471e-9547-f7a9774c6aec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81ef0c89-560c-4bc4-ad33-755b195bfd1f"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e98f499-e58e-4463-ad4c-5239dcbf432c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d012716e-924c-4558-84f7-5d789a3c067c"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.296875, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7abd938f-4294-4422-9894-d5854a61cc68"], "isController": false}, {"data": [0.9568965517241379, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.47413793103448276, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9274193548387096, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9983d275-b57d-4933-b23c-e7b8ffd12a59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e30bee30-1fe1-4d85-9724-dfbdf8c9ca44"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=664ce384-ecc5-444f-8f24-6ecd66ab8917"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/064bb0b7-5f47-45c3-b00d-54554adbfe18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19006203-8068-4c23-8494-c32889becc23"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d012716e-924c-4558-84f7-5d789a3c067c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a3f4dca-d104-491e-806f-933a2413b066"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7df4ed4c-fe2f-42e0-b6e0-e5e42df4b6f4"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdaae7b8-a983-4663-b6d5-d9ac9c3c7165"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1352, 17, 1.257396449704142, 413.90902366863907, 115, 2475, 139.0, 1209.7, 1471.499999999999, 1910.860000000001, 5.438608488573693, 735.0415678501105, 3.9784650198818956], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2065.3103448275865, 1478, 2536, 2083.0, 2500.8, 2530.2, 2536.0, 0.246005590264965, 296.0271604884271, 1.209607565414159], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f3ae9f8c-2f3c-4703-b2d8-39075e35d64f", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.7657936151079137, 1.430886540767386], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 575.4615384615386, 128, 1396, 485.0, 1171.1999999999998, 1396.0, 1396.0, 0.08690188109148762, 0.01646383294116074, 0.05874624608941535], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 575.4615384615386, 128, 1396, 485.0, 1171.1999999999998, 1396.0, 1396.0, 0.08926916025187637, 0.016912321375843763, 0.060346542450919125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81ef0c89-560c-4bc4-ad33-755b195bfd1f", 3, 0, 0.0, 559.6666666666666, 219, 1026, 434.0, 1026.0, 1026.0, 1026.0, 0.021375438196483028, 0.02526504430059566, 0.013707556395531107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 151.26315789473685, 117, 379, 125.0, 379.0, 379.0, 379.0, 0.08364332724351214, 0.022381124672580396, 0.04770283506856551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 126.73684210526315, 121, 138, 127.0, 132.0, 138.0, 138.0, 0.08364111797359583, 0.06215907302529924, 0.04198392054534009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 138.6315789473684, 119, 380, 126.0, 133.0, 380.0, 380.0, 0.08364148617714387, 0.022543994321183307, 0.049253726723454835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 148.94736842105263, 120, 362, 126.0, 346.0, 362.0, 362.0, 0.08355504738450713, 0.022520696365355437, 0.04912122902878251], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 254.07142857142858, 127, 423, 234.0, 386.0, 423.0, 423.0, 0.09167043170225443, 0.209097594633351, 0.05925710732315791], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 125.46666666666667, 122, 130, 125.0, 129.4, 130.0, 130.0, 0.07725865683249808, 0.05741585727493266, 0.03878022423037501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 158.8, 120, 381, 126.0, 377.4, 381.0, 381.0, 0.07726024857197307, 0.02067315244992248, 0.04406248551370339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 947.0, 753, 1091, 997.0, 1091.0, 1091.0, 1091.0, 0.048341094764659434, 14.213886936221982, 0.027569530607969836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1312.0, 1116, 1448, 1372.0, 1448.0, 1448.0, 1448.0, 0.047863684227320596, 43.0678272031255, 0.027250515531765534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 287.6666666666667, 129, 380, 354.0, 380.0, 380.0, 380.0, 0.04865390853065196, 0.08609461157963023, 0.026940201305546547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 143.73333333333332, 117, 381, 125.0, 245.4000000000001, 381.0, 381.0, 0.0819018706387254, 0.060866526910224636, 0.041110899910453955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 189.9333333333333, 118, 380, 127.0, 378.2, 380.0, 380.0, 0.0819018706387254, 0.030116000349447985, 0.0462510954375198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 266.2, 116, 1515, 125.0, 832.8000000000004, 1515.0, 1515.0, 0.08179111639421137, 4.926961598048464, 0.0476156355987655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 236.73333333333332, 121, 805, 129.0, 550.0000000000001, 805.0, 805.0, 0.08179022443237584, 1.6238447982780433, 0.04769498959900979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 129.66666666666666, 126, 137, 126.0, 137.0, 137.0, 137.0, 0.04882574093061862, 0.036285535984571064, 0.027416797885845418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 826.2631578947367, 121, 1628, 1078.0, 1595.0, 1628.0, 1628.0, 0.09970926876371002, 47.23303294276163, 0.0541082678663266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 192.93333333333334, 119, 381, 127.0, 380.4, 381.0, 381.0, 0.07715811240393815, 0.020796522483873953, 0.04536053092497145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 569.421052631579, 122, 1127, 701.0, 1002.0, 1127.0, 1127.0, 0.09958436630274695, 15.423824838961597, 0.054137738609382945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 222.99999999999997, 118, 378, 129.0, 376.8, 378.0, 378.0, 0.07715890619534578, 0.020796736435464293, 0.04543634808182959], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 492.3076923076923, 129, 795, 474.0, 764.1999999999999, 795.0, 795.0, 0.08950024440451357, 0.016956100990698858, 0.06121542407625421], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 462.59999999999997, 245, 1633, 265.0, 1108.0000000000002, 1633.0, 1633.0, 0.0817336246682977, 6.637015098243817, 0.1824266832358887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2dd0d60-8f62-46ae-9718-84bd5a1fa676", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 604.4, 144, 1520, 615.5, 1394.5000000000005, 1514.75, 1520.0, 0.08726269999520055, 0.05360179521189565, 0.03945569345486118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e30bee30-1fe1-4d85-9724-dfbdf8c9ca44", 3, 0, 0.0, 330.3333333333333, 252, 449, 290.0, 449.0, 449.0, 449.0, 0.019205777097751002, 0.022700578333962856, 0.012316204714378085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 165.21052631578948, 119, 390, 126.0, 366.0, 390.0, 390.0, 0.09970351323695327, 0.07409606794269671, 0.05004649004276756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 242.1052631578947, 118, 381, 132.0, 380.0, 381.0, 381.0, 0.0995786251860548, 0.10536212880757216, 0.05238933015031132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7abd938f-4294-4422-9894-d5854a61cc68", 3, 0, 0.0, 491.0, 420, 630, 423.0, 630.0, 630.0, 630.0, 0.03333407409053535, 0.027789246011022464, 0.021376343085401896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21b08166-0c3d-43ab-a7e5-29b771db09ca", 2, 0, 0.0, 278.5, 236, 321, 278.5, 321.0, 321.0, 321.0, 0.02404250715264588, 0.027353047688312936, 0.014944390432284278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/035a2233-6a62-4364-8344-1765ebd1e6ec", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["login", 20, 0, 0.0, 2726.65, 1733, 3722, 2728.0, 3454.8, 3708.7, 3722.0, 0.08788890841975742, 15.895185438730445, 0.15446647312796624], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 130.8666666666667, 124, 143, 130.0, 138.8, 143.0, 143.0, 0.07611663097642414, 0.06162176472603087, 0.02705708366740077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=064bb0b7-5f47-45c3-b00d-54554adbfe18", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/664ce384-ecc5-444f-8f24-6ecd66ab8917", 3, 0, 0.0, 407.0, 236, 522, 463.0, 522.0, 522.0, 522.0, 0.023270425616084518, 0.03208016031384047, 0.01492276642698128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e98f499-e58e-4463-ad4c-5239dcbf432c", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a3f4dca-d104-491e-806f-933a2413b066", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1019.0, 246, 1755, 1202.0, 1722.0, 1755.0, 1755.0, 0.09950769875353514, 62.7287357530507, 0.2103951584921965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9983d275-b57d-4933-b23c-e7b8ffd12a59", 3, 0, 0.0, 348.6666666666667, 222, 566, 258.0, 566.0, 566.0, 566.0, 0.016304081998663067, 0.022476493250110054, 0.010455417167111406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ebec0c7-821f-471e-9547-f7a9774c6aec", 3, 0, 0.0, 309.6666666666667, 232, 449, 248.0, 449.0, 449.0, 449.0, 0.02727619878893677, 0.027356109527576236, 0.017491572791082502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7df4ed4c-fe2f-42e0-b6e0-e5e42df4b6f4", 3, 0, 0.0, 346.3333333333333, 224, 494, 321.0, 494.0, 494.0, 494.0, 0.03419426904050881, 0.028506355147377302, 0.021927965497982538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 306.5263157894737, 243, 513, 255.0, 509.0, 513.0, 513.0, 0.08350767391571878, 0.12942058447680244, 0.18781071584755893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 1113.75, 127, 1586, 1371.0, 1586.0, 1586.0, 1586.0, 0.0349778764931181, 31.386615251009985, 0.0647978825268018], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1298.333333333333, 229, 2475, 1187.0, 2193.0, 2450.3999999999996, 2475.0, 0.08510672788947474, 0.02716576358972073, 0.03839776199700911], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fdaae7b8-a983-4663-b6d5-d9ac9c3c7165", 2, 0, 0.0, 239.0, 220, 258, 239.0, 258.0, 258.0, 258.0, 0.018687921062221433, 0.0313807424477439, 0.011616075933695257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 144.23529411764707, 120, 374, 129.0, 193.19999999999985, 374.0, 374.0, 0.07640174735290416, 0.059315809712459776, 0.027158433629352653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 434.73333333333335, 251, 510, 497.0, 508.2, 510.0, 510.0, 0.07710813645055825, 0.1195025513154648, 0.1734180060992536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ebec0c7-821f-471e-9547-f7a9774c6aec", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81ef0c89-560c-4bc4-ad33-755b195bfd1f", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 559.85, 248, 1260, 499.5, 1244.7, 1259.3, 1260.0, 0.11703777394153964, 28.148681862070983, 0.2572316543289347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 155.11111111111111, 120, 389, 127.0, 389.0, 389.0, 389.0, 0.05150656708730363, 0.03827782964202935, 0.025853882307494202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 181.66666666666666, 122, 377, 125.0, 377.0, 377.0, 377.0, 0.05150833576567141, 0.013782503906048795, 0.029375847741359474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 181.55555555555554, 119, 377, 125.0, 377.0, 377.0, 377.0, 0.05150863055720892, 0.013883185579872715, 0.03028144101117165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 155.44444444444446, 120, 375, 127.0, 375.0, 375.0, 375.0, 0.05143386176863906, 0.013863033054828496, 0.03028771352196226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 2.2862160852713176, 4.791969476744186], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1425.1724137931037, 961, 2018, 1364.0, 1970.9, 2006.1, 2018.0, 0.2482568516750917, 297.00150264949986, 0.49021030672562055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1298.333333333333, 229, 2475, 1187.0, 2193.0, 2450.3999999999996, 2475.0, 0.08875402034580257, 0.028329966315736088, 0.04004331777320389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 216.375, 121, 377, 129.5, 377.0, 377.0, 377.0, 0.0407659930086322, 0.010987709053107898, 0.024005755648637907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 152.25, 117, 353, 125.0, 353.0, 353.0, 353.0, 0.040766823958662435, 0.010987933020108236, 0.023966433616323037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e98f499-e58e-4463-ad4c-5239dcbf432c", 3, 0, 0.0, 416.0, 253, 704, 291.0, 704.0, 704.0, 704.0, 0.03302728053372085, 0.02753348484598278, 0.02117960372767906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 139.23529411764707, 116, 375, 125.0, 178.99999999999983, 375.0, 375.0, 0.07731067978825969, 0.02083764416167937, 0.04545022385989486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 152.47058823529412, 117, 378, 124.0, 374.8, 378.0, 378.0, 0.07730892190434613, 0.020837170357030792, 0.04552468741046945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 138.47058823529412, 119, 349, 127.0, 173.79999999999984, 349.0, 349.0, 0.07730786721236925, 0.05745242866075489, 0.03880492553433379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 124.875, 121, 133, 123.5, 133.0, 133.0, 133.0, 0.0407657852764175, 0.010908032388416403, 0.02324923691545686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 150.88235294117646, 116, 361, 124.0, 349.0, 361.0, 361.0, 0.07731067978825969, 0.020686646740217925, 0.044091247066741855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 126.25, 122, 132, 126.5, 132.0, 132.0, 132.0, 0.040766823958662435, 0.030296438508341912, 0.020463034682375484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 137.0, 123, 158, 136.5, 158.0, 158.0, 158.0, 0.04038181001367934, 0.03178490124123588, 0.014354471528300076], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 493.5454545454545, 406, 704, 449.0, 689.2, 704.0, 704.0, 0.08421246038186522, 0.015214165205708072, 0.05732039539664068], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1612.6999999999998, 1128, 2175, 1608.5, 2012.7000000000003, 2167.5499999999997, 2175.0, 0.08837982111924206, 0.0457434621027327, 0.04065126537808888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d012716e-924c-4558-84f7-5d789a3c067c", 3, 0, 0.0, 327.3333333333333, 206, 427, 349.0, 427.0, 427.0, 427.0, 0.030171069966711254, 0.02515237961743083, 0.019347984321100638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 344.49999999999994, 249, 505, 260.0, 505.0, 505.0, 505.0, 0.040739213020252484, 0.06313782330384833, 0.09162344490785299], "isController": false}, {"data": ["addBook", 64, 11, 17.1875, 1212.46875, 620, 3105, 991.5, 2204.0, 2360.5, 3105.0, 0.29765365207078576, 84.5608155244983, 1.0843720205567053], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7abd938f-4294-4422-9894-d5854a61cc68", 1, 0, 0.0, 795.0, 795, 795, 795.0, 795.0, 795.0, 795.0, 1.2578616352201257, 0.22725039308176098, 0.8672366352201257], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 217.94827586206898, 121, 519, 128.5, 497.7, 508.45, 519.0, 0.24941838213476333, 0.18535877812944815, 0.12056845620772251], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 776.8620689655171, 586, 1172, 729.5, 1007.0, 1085.1, 1172.0, 0.2492608127621536, 73.29095518999691, 0.12536066266846593], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 188.56896551724134, 116, 554, 129.0, 374.1, 379.34999999999997, 554.0, 0.24986322142620204, 0.44214077853933403, 0.12151551198266465], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1204.8620689655172, 834, 1526, 1230.0, 1487.3, 1507.05, 1526.0, 0.24884693768100397, 223.91291195162503, 0.1249094980156602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 155.25, 119, 383, 130.0, 354.6000000000005, 382.75, 383.0, 0.1205879870247326, 0.09008770515031292, 0.042865261012697914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 11, 5.913978494623656, 191.60752688172047, 119, 1214, 131.0, 353.90000000000003, 419.95000000000005, 985.1899999999988, 0.765246298223888, 1.5630568671083975, 0.3698867224624474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 160.8888888888889, 125, 380, 135.0, 380.0, 380.0, 380.0, 0.052033347594324895, 0.040295356095995744, 0.018496229027670178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 144.26315789473685, 123, 366, 131.0, 147.0, 366.0, 366.0, 0.08182812648044308, 0.06640544248559395, 0.029087341834845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9983d275-b57d-4933-b23c-e7b8ffd12a59", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e30bee30-1fe1-4d85-9724-dfbdf8c9ca44", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 368.22222222222223, 245, 767, 260.0, 767.0, 767.0, 767.0, 0.05139626520472846, 0.0796541727342813, 0.11559140504540003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 323.4117647058824, 246, 723, 255.0, 550.9999999999999, 723.0, 723.0, 0.07726324496539061, 0.11974293921882315, 0.17376684878446738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=664ce384-ecc5-444f-8f24-6ecd66ab8917", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/064bb0b7-5f47-45c3-b00d-54554adbfe18", 3, 0, 0.0, 303.0, 211, 407, 291.0, 407.0, 407.0, 407.0, 0.046323461289027514, 0.028816450040147, 0.02970612589172663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19006203-8068-4c23-8494-c32889becc23", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d012716e-924c-4558-84f7-5d789a3c067c", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 149.53333333333333, 123, 379, 130.0, 245.20000000000007, 379.0, 379.0, 0.07718153611838618, 0.06399133219190417, 0.02743562416708259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 138.36842105263156, 123, 249, 132.0, 155.0, 249.0, 249.0, 0.096132440144907, 0.07463407218281354, 0.03417207833275991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a3f4dca-d104-491e-806f-933a2413b066", 3, 0, 0.0, 356.3333333333333, 218, 445, 406.0, 445.0, 445.0, 445.0, 0.047530023131277924, 0.03055722515764124, 0.030479865093951012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 137.64999999999998, 120, 347, 127.5, 132.8, 336.29999999999984, 347.0, 0.11712413401343413, 0.08704244725021815, 0.05879082508096206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 221.29999999999995, 115, 379, 128.0, 377.8, 378.95, 379.0, 0.11728072901701157, 0.0666117890588808, 0.0649167160223068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 401.7, 115, 1132, 245.5, 1116.3, 1131.3, 1132.0, 0.11727660273137208, 21.13042642505732, 0.06693012366817758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7df4ed4c-fe2f-42e0-b6e0-e5e42df4b6f4", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 341.95, 116, 997, 126.5, 972.7, 995.85, 997.0, 0.11728004128257453, 6.9221337490910795, 0.0670466173504093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdaae7b8-a983-4663-b6d5-d9ac9c3c7165", 1, 0, 0.0, 718.0, 718, 718, 718.0, 718.0, 718.0, 718.0, 1.392757660167131, 0.2516212569637883, 0.9602411211699164], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 17.647058823529413, 0.22189349112426035], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07396449704142012], "isController": false}, {"data": ["401/Unauthorized", 13, 76.47058823529412, 0.9615384615384616], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1352, 17, "401/Unauthorized", 13, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
