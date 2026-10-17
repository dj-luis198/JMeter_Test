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

    var data = {"OkPercent": 99.182156133829, "KoPercent": 0.8178438661710037};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8415809768637532, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.30833333333333335, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5395022-c54f-4e97-ba83-987409184bee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea9b291d-05e5-42b8-a9e6-f90a4f5925c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4a40643-891c-4c26-bbc5-19b7e40d03c8"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5744c0f2-bd72-4798-b187-c8836b2ebe5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/446f71bf-d365-4229-b2b2-ec5eeea059fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/116725ca-8978-46d8-8adb-44518f8fab70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ddac69b-bf0a-4821-bd02-9e21447320e7"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3efc3688-9b8c-4f57-bb74-bed5c68fee10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/167ca66a-a47b-4abe-924c-d9d7ab9d5090"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85d57df5-99e0-4a32-b441-501a14c9cdb1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=628e2f19-2691-4f88-b6af-31393fe92882"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/519998c9-0c89-48e5-895d-d3266726c35c"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e90a147f-61eb-4362-9cd3-b4eaef98b55d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8484e87-a550-4f27-8212-c476f97e63ea"], "isController": false}, {"data": [0.5, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea9b291d-05e5-42b8-a9e6-f90a4f5925c4"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.47619047619047616, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5744c0f2-bd72-4798-b187-c8836b2ebe5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ddac69b-bf0a-4821-bd02-9e21447320e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/628e2f19-2691-4f88-b6af-31393fe92882"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c14e560d-9433-4e41-b8a0-f060fe3b05d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=116725ca-8978-46d8-8adb-44518f8fab70"], "isController": false}, {"data": [0.38333333333333336, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=446f71bf-d365-4229-b2b2-ec5eeea059fa"], "isController": false}, {"data": [0.8083333333333333, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3efc3688-9b8c-4f57-bb74-bed5c68fee10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5395022-c54f-4e97-ba83-987409184bee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c14e560d-9433-4e41-b8a0-f060fe3b05d3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e90a147f-61eb-4362-9cd3-b4eaef98b55d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/296d3b04-c62f-4636-aa40-712fca07ab59"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3437b46e-a718-4af2-991d-06849a698bb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85d57df5-99e0-4a32-b441-501a14c9cdb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=519998c9-0c89-48e5-895d-d3266726c35c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91c18d3b-5013-4598-80e1-30e2b95d737e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1345, 11, 0.8178438661710037, 288.5182156133832, 82, 1994, 93.0, 825.4000000000001, 996.4000000000001, 1280.3999999999996, 5.3293498589406285, 752.4584628936586, 3.8953187344973372], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1424.8, 1007, 1804, 1427.5, 1675.8, 1769.35, 1804.0, 0.26203047414414293, 315.3118249644621, 1.2884017942536716], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5395022-c54f-4e97-ba83-987409184bee", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.2603228566282421, 0.9934483069164266], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 488.41666666666663, 422, 763, 449.0, 699.1000000000003, 763.0, 763.0, 0.08550418970529555, 0.015447534272929374, 0.058116128940318076], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 488.41666666666663, 422, 763, 449.0, 699.1000000000003, 763.0, 763.0, 0.08512691003504391, 0.01537937339500305, 0.057859696664443905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea9b291d-05e5-42b8-a9e6-f90a4f5925c4", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 125.52941176470591, 83, 262, 87.0, 261.2, 262.0, 262.0, 0.09314302934005424, 0.041381444675780074, 0.05220033284935485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 106.88235294117648, 84, 261, 86.0, 253.0, 261.0, 261.0, 0.09314098806151688, 0.06921903507306089, 0.04675241002306609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 181.29411764705878, 82, 665, 85.0, 661.8, 665.0, 665.0, 0.09314200868960151, 3.2441327383202663, 0.0539065795925859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 239.8823529411765, 83, 1080, 85.0, 1070.4, 1080.0, 1080.0, 0.09314200868960151, 9.882073912977969, 0.05381562059972496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4a40643-891c-4c26-bbc5-19b7e40d03c8", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 200.08333333333331, 174, 296, 190.5, 274.70000000000005, 296.0, 296.0, 0.08656197476718436, 0.1983641477432572, 0.05596096415612895], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5744c0f2-bd72-4798-b187-c8836b2ebe5e", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/446f71bf-d365-4229-b2b2-ec5eeea059fa", 3, 0, 0.0, 256.0, 176, 410, 182.0, 410.0, 410.0, 410.0, 0.023722165991902834, 0.028038797108267965, 0.015212456707047064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 24, 0, 0.0, 93.29166666666666, 83, 255, 85.0, 92.0, 214.75, 255.0, 0.12822636227153, 0.09529322430530696, 0.06436362324957658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/116725ca-8978-46d8-8adb-44518f8fab70", 3, 0, 0.0, 533.6666666666666, 174, 1034, 393.0, 1034.0, 1034.0, 1034.0, 0.016446466750726384, 0.02267278212543172, 0.010546725097308262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 24, 0, 0.0, 105.08333333333334, 82, 259, 84.0, 247.5, 256.25, 259.0, 0.1282291026634253, 0.042336057088665086, 0.07268194173590148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 674.6666666666666, 664, 690, 670.0, 690.0, 690.0, 690.0, 0.0344883084634309, 10.140707807865633, 0.019669113420550433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 886.3333333333334, 756, 988, 915.0, 988.0, 988.0, 988.0, 0.03439933035970233, 30.952577925233054, 0.01958477499971334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 87.0, 83, 93, 85.0, 93.0, 93.0, 93.0, 0.03473066370298336, 0.06145699475566978, 0.01923074835897614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 109.14285714285712, 83, 260, 85.0, 254.5, 260.0, 260.0, 0.08721002666135101, 0.06481135770438293, 0.043775345413998454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 108.21428571428574, 83, 258, 84.0, 253.5, 258.0, 258.0, 0.08730030056246336, 0.02335965073644039, 0.049788452664529886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 110.57142857142857, 83, 286, 84.0, 269.0, 286.0, 286.0, 0.08730030056246336, 0.02353015913597645, 0.05132302826035443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 134.2857142857143, 83, 277, 86.5, 264.5, 277.0, 277.0, 0.0872986674481976, 0.023529718960647008, 0.05140732077271792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 86.33333333333333, 85, 89, 85.0, 89.0, 89.0, 89.0, 0.03472985957560111, 0.02580998353225825, 0.019501630132783828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 713.0666666666667, 83, 1387, 913.0, 1268.8000000000002, 1387.0, 1387.0, 0.07634481389679199, 45.80365760050795, 0.04050847872779002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 24, 0, 0.0, 131.04166666666666, 82, 1035, 84.0, 169.0, 838.5, 1035.0, 0.12822773245283625, 4.840602117694359, 0.07492473299246127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 471.7333333333333, 83, 834, 495.0, 744.6, 834.0, 834.0, 0.07634869978164271, 14.972894620979604, 0.040585099851374526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 24, 0, 0.0, 120.54166666666666, 83, 433, 85.0, 255.5, 390.0, 433.0, 0.12822704735852283, 1.6040798740970679, 0.07504955441101042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ddac69b-bf0a-4821-bd02-9e21447320e7", 3, 0, 0.0, 279.3333333333333, 192, 431, 215.0, 431.0, 431.0, 431.0, 0.015440597448183928, 0.02128611008888637, 0.009901685212539823], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 439.16666666666663, 191, 694, 429.5, 643.6000000000001, 694.0, 694.0, 0.08513778130941908, 0.015381337443596219, 0.05869850937934557], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3efc3688-9b8c-4f57-bb74-bed5c68fee10", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/167ca66a-a47b-4abe-924c-d9d7ab9d5090", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 246.0, 169, 519, 172.5, 510.5, 519.0, 519.0, 0.08716224629560454, 0.13508445788195741, 0.19602993478396213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85d57df5-99e0-4a32-b441-501a14c9cdb1", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 311.09523809523813, 114, 873, 284.0, 559.4000000000001, 842.6999999999996, 873.0, 0.09088351762491075, 0.05582591072858287, 0.041092840488607105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 85.66666666666666, 83, 89, 86.0, 88.4, 89.0, 89.0, 0.07641248478118011, 0.05678701261570124, 0.0383554855249283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=628e2f19-2691-4f88-b6af-31393fe92882", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 152.73333333333335, 83, 262, 87.0, 261.4, 262.0, 262.0, 0.07641326330482269, 0.09695927746165328, 0.03930109245495438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/519998c9-0c89-48e5-895d-d3266726c35c", 3, 0, 0.0, 267.0, 178, 427, 196.0, 427.0, 427.0, 427.0, 0.0422267576887888, 0.026762857167992118, 0.02707900802308396], "isController": false}, {"data": ["login", 21, 0, 0.0, 1618.5238095238096, 1107, 2488, 1505.0, 2299.8, 2476.2999999999997, 2488.0, 0.08900794289928539, 15.337168743430366, 0.15537896058855444], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e90a147f-61eb-4362-9cd3-b4eaef98b55d", 3, 0, 0.0, 296.0, 186, 406, 296.0, 406.0, 406.0, 406.0, 0.045778462759220546, 0.029431140608548366, 0.02935663139181786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 24, 0, 0.0, 104.66666666666667, 83, 300, 88.0, 183.0, 290.75, 300.0, 0.12973744384801258, 0.10503158295898675, 0.046117606992848226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 800.1333333333333, 170, 1473, 999.0, 1354.2, 1473.0, 1473.0, 0.07631102338169755, 60.90243170640351, 0.15860868629301397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 388.29411764705884, 169, 1341, 336.0, 1193.8, 1341.0, 1341.0, 0.09309763203434755, 13.230500880662525, 0.20657641501555277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 973.3333333333334, 845, 1074, 1001.0, 1074.0, 1074.0, 1074.0, 0.034365442111412764, 41.11301612598371, 0.07749004476098835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8484e87-a550-4f27-8212-c476f97e63ea", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 628.8636363636363, 142, 1459, 633.0, 1017.1999999999999, 1393.8999999999992, 1459.0, 0.09328793320583982, 0.029649396384668552, 0.04208889173935351], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 87.33333333333333, 84, 95, 86.0, 92.0, 95.0, 95.0, 0.08813989564236356, 0.0684289228864053, 0.03133097852912142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 24, 0, 0.0, 261.25, 169, 1124, 173.5, 427.5, 969.5, 1124.0, 0.1281681566214874, 6.57926220034018, 0.2868868121642261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea9b291d-05e5-42b8-a9e6-f90a4f5925c4", 3, 0, 0.0, 523.3333333333333, 198, 1147, 225.0, 1147.0, 1147.0, 1147.0, 0.0350930550843988, 0.02925563609086762, 0.022504335454513552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 318.0625000000001, 169, 1070, 263.5, 668.9000000000004, 1070.0, 1070.0, 0.13098649201801066, 9.984402182255423, 0.29249705792058944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 100.0, 84, 250, 85.0, 217.2000000000001, 250.0, 250.0, 0.056410256410256404, 0.04192207532051282, 0.028315304487179487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 117.36363636363636, 83, 262, 84.0, 260.6, 262.0, 262.0, 0.056411702864176, 0.022797058898946128, 0.031741599143567785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 195.27272727272725, 82, 1022, 84.0, 887.4000000000004, 1022.0, 1022.0, 0.05614106719064996, 4.606104423979891, 0.03256620499145125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 208.90909090909088, 83, 686, 101.0, 615.6000000000003, 686.0, 686.0, 0.05623779384247283, 1.5170324626274296, 0.03267723372682747], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 979.1833333333335, 662, 1458, 955.0, 1332.4, 1422.45, 1458.0, 0.26243045592917874, 313.95806087949194, 0.5181976385632807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 628.8636363636363, 142, 1459, 633.0, 1017.1999999999999, 1393.8999999999992, 1459.0, 0.09086553552842438, 0.02887949371375704, 0.04099597403723835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 85.625, 83, 93, 84.5, 93.0, 93.0, 93.0, 0.03563903008379627, 0.009605832327273212, 0.020986655410673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 125.62499999999999, 83, 252, 84.5, 252.0, 252.0, 252.0, 0.03563903008379627, 0.009605832327273212, 0.02095185167035679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 183.9333333333333, 82, 908, 85.0, 515.6000000000003, 908.0, 908.0, 0.0877023732262195, 5.283045934483404, 0.051056941496670234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 189.99999999999997, 82, 519, 247.0, 358.2000000000001, 519.0, 519.0, 0.08778963262965066, 1.7429557050092765, 0.05119347262133991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 85.0, 82, 96, 83.5, 96.0, 96.0, 96.0, 0.035639347621741785, 0.009536309812848877, 0.02032556544052461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 122.6, 83, 302, 86.0, 278.6, 302.0, 302.0, 0.08778809125279459, 0.06524095453454754, 0.04406550674212541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 85.625, 84, 89, 85.0, 89.0, 89.0, 89.0, 0.03563823626368731, 0.026485056442056683, 0.01788872406204617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 152.40000000000003, 83, 261, 88.0, 261.0, 261.0, 261.0, 0.08770493720326496, 0.03224983628411722, 0.049528165709708354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 88.875, 85, 105, 86.5, 105.0, 105.0, 105.0, 0.0365744381251943, 0.028788083133697857, 0.013001069802315163], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 487.0833333333333, 393, 1147, 408.5, 979.9000000000005, 1147.0, 1147.0, 0.08177617859917406, 0.014774016641452345, 0.05566210594103938], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 935.9047619047619, 733, 1994, 825.0, 1258.0, 1923.099999999999, 1994.0, 0.08942753601587553, 0.04628573641446682, 0.041133173304177116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 213.0, 169, 341, 170.5, 341.0, 341.0, 341.0, 0.035624588090700196, 0.055211153613223846, 0.08012053356726813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5744c0f2-bd72-4798-b187-c8836b2ebe5e", 3, 0, 0.0, 303.0, 205, 405, 299.0, 405.0, 405.0, 405.0, 0.022916507524253303, 0.027086536074402263, 0.014695807233977542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ddac69b-bf0a-4821-bd02-9e21447320e7", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/628e2f19-2691-4f88-b6af-31393fe92882", 3, 0, 0.0, 258.6666666666667, 180, 399, 197.0, 399.0, 399.0, 399.0, 0.022316779242419735, 0.022382160431606513, 0.014311215855327759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c14e560d-9433-4e41-b8a0-f060fe3b05d3", 3, 0, 0.0, 355.0, 199, 590, 276.0, 590.0, 590.0, 590.0, 0.03499807510586918, 0.02917645519079784, 0.022443427069844493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=116725ca-8978-46d8-8adb-44518f8fab70", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["addBook", 60, 7, 11.666666666666666, 893.7666666666669, 428, 2437, 707.0, 1523.0, 1704.5999999999997, 2437.0, 0.29527704368623864, 95.32448890158169, 1.0733061017155596], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 141.06666666666663, 83, 390, 87.0, 342.6, 351.75, 390.0, 0.26347452640453883, 0.19580479940806056, 0.12736317438500655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=446f71bf-d365-4229-b2b2-ec5eeea059fa", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 534.4999999999999, 412, 782, 497.0, 741.7, 749.85, 782.0, 0.26343519494204426, 77.45869418466808, 0.1324893802687039], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 117.21666666666668, 83, 341, 86.0, 250.9, 253.0, 341.0, 0.2638197583411014, 0.466837306752027, 0.12830296841198094], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 836.2333333333332, 576, 1091, 828.0, 1041.2, 1074.7, 1091.0, 0.26286850879076107, 236.5295462834774, 0.1319476694516125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 88.25, 85, 91, 88.5, 90.3, 91.0, 91.0, 0.12180453417378462, 0.0909965514091262, 0.0432977055070875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 7, 3.888888888888889, 135.25555555555562, 84, 1234, 89.0, 213.9, 262.0, 505.80999999999796, 0.7651662323639811, 1.6653574043648482, 0.3663972267506366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 121.81818181818181, 85, 262, 89.0, 262.0, 262.0, 262.0, 0.055415058790339644, 0.04291420080150326, 0.019698321679378544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3efc3688-9b8c-4f57-bb74-bed5c68fee10", 3, 0, 0.0, 265.3333333333333, 189, 407, 200.0, 407.0, 407.0, 407.0, 0.10515984296130117, 0.04758209040241167, 0.0674364878365115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5395022-c54f-4e97-ba83-987409184bee", 3, 0, 0.0, 275.6666666666667, 195, 430, 202.0, 430.0, 430.0, 430.0, 0.06643194047698132, 0.04270933673243429, 0.0426012118293142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 87.70588235294117, 85, 94, 87.0, 93.2, 94.0, 94.0, 0.09174163397246672, 0.07445048616320298, 0.03261128395115028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c14e560d-9433-4e41-b8a0-f060fe3b05d3", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e90a147f-61eb-4362-9cd3-b4eaef98b55d", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/296d3b04-c62f-4636-aa40-712fca07ab59", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 343.6363636363636, 169, 1107, 193.0, 986.8000000000004, 1107.0, 1107.0, 0.05611615022803563, 6.182192320887451, 0.12490127861923662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 375.2666666666667, 172, 997, 335.0, 737.2000000000002, 997.0, 997.0, 0.0876577840112202, 7.118074578512155, 0.19564920633181393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3437b46e-a718-4af2-991d-06849a698bb5", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85d57df5-99e0-4a32-b441-501a14c9cdb1", 3, 0, 0.0, 296.6666666666667, 194, 400, 296.0, 400.0, 400.0, 400.0, 0.024910736527443328, 0.02498371720086357, 0.015974658515320102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 100.21428571428571, 85, 252, 88.5, 174.5, 252.0, 252.0, 0.0920616550055237, 0.07632846201141565, 0.03272504142774475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=519998c9-0c89-48e5-895d-d3266726c35c", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 87.93333333333332, 84, 96, 87.0, 93.6, 96.0, 96.0, 0.07333206224425444, 0.05693260691814675, 0.026067256500887318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91c18d3b-5013-4598-80e1-30e2b95d737e", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.7963489713216957, 1.487979270573566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 96.93749999999999, 83, 248, 85.0, 150.7000000000001, 248.0, 248.0, 0.1310777045016999, 0.09741223938065785, 0.06579486339245484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 115.25000000000001, 83, 253, 84.0, 250.2, 253.0, 253.0, 0.13107877834578582, 0.04737845003440818, 0.07406783019563508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 188.125, 83, 987, 84.5, 542.5000000000005, 987.0, 987.0, 0.13107985220746662, 7.404739573519412, 0.07635657406421274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 189.875, 83, 688, 87.5, 443.7000000000003, 688.0, 688.0, 0.1310809260867428, 2.4420062908603826, 0.07648520833674691], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 36.36363636363637, 0.29739776951672864], "isController": false}, {"data": ["401/Unauthorized", 7, 63.63636363636363, 0.5204460966542751], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1345, 11, "401/Unauthorized", 7, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
