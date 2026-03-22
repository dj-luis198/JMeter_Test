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

    var data = {"OkPercent": 98.14951887490747, "KoPercent": 1.8504811250925242};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7861234882240611, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1271186440677966, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fd9f390-4305-4ae0-961e-9df7aca118ff"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c30ae77-2b65-4b5c-95e5-73e8a0107f89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8eb4ed5-de1a-459d-8308-274981c5f8eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cca91bd-74a1-43d9-acc6-d5550d106fd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc2202ca-2208-4f0b-a66a-82ed48f755b1"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8eb4ed5-de1a-459d-8308-274981c5f8eb"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ecc5a1d-3c71-4b8c-bcc6-c6bf47b1b68a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c30ae77-2b65-4b5c-95e5-73e8a0107f89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5322d901-cd72-42c4-b524-b8b6ecddeaa6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/20faeffd-f41a-4ec8-ab93-67392cc84f63"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd8788a3-2d80-45f9-8909-fb71cb5aa28e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=603e5c0e-6aee-4cdc-a607-3c708db19abc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e40c9d9a-84d4-4741-a60c-b2bfe3662a4e"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82d2fb94-3aae-4d3c-8dfb-0bff4885c706"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50702969-09f4-4117-a819-4f656ab76ace"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4830508474576271, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebadb1f7-bcf7-477c-9665-1cfff7cba694"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/285873f8-aec9-44e3-8dea-4c0921668519"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9fd9f390-4305-4ae0-961e-9df7aca118ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=133ef899-9597-4076-bb31-ad56551b74e1"], "isController": false}, {"data": [0.25833333333333336, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9078212290502793, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5322d901-cd72-42c4-b524-b8b6ecddeaa6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3cca91bd-74a1-43d9-acc6-d5550d106fd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/133ef899-9597-4076-bb31-ad56551b74e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9130434782608695, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ecc5a1d-3c71-4b8c-bcc6-c6bf47b1b68a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebadb1f7-bcf7-477c-9665-1cfff7cba694"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20faeffd-f41a-4ec8-ab93-67392cc84f63"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd8788a3-2d80-45f9-8909-fb71cb5aa28e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82d2fb94-3aae-4d3c-8dfb-0bff4885c706"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e40c9d9a-84d4-4741-a60c-b2bfe3662a4e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/603e5c0e-6aee-4cdc-a607-3c708db19abc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 25, 1.8504811250925242, 350.66765358993314, 107, 2028, 126.0, 906.0, 1108.5999999999988, 1463.92, 5.328148478263442, 758.362667811042, 3.8949961473463772], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1656.3728813559323, 1325, 2331, 1612.0, 1951.0, 2028.0, 2331.0, 0.25918230180241525, 311.8859220698672, 1.2743973531007429], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fd9f390-4305-4ae0-961e-9df7aca118ff", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 542.4285714285714, 131, 1026, 511.0, 963.0, 1026.0, 1026.0, 0.07684074755070117, 0.014509479884190017, 0.05196505632701227], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 542.4285714285714, 131, 1026, 511.0, 963.0, 1026.0, 1026.0, 0.0775219553252046, 0.014638109170293586, 0.05242573638935956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 204.70000000000002, 108, 381, 116.0, 345.9, 379.25, 381.0, 0.09257330648707446, 0.03172263012335393, 0.05240697829155963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 125.84999999999998, 108, 325, 115.5, 126.4, 315.09999999999985, 325.0, 0.09257030714827912, 0.0687949255271879, 0.046465954955288546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 156.65, 107, 540, 114.5, 339.5, 529.9999999999999, 540.0, 0.09257202103236319, 1.384665893111716, 0.054114855263645116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 193.35000000000005, 108, 1020, 115.0, 344.7, 986.2499999999995, 1020.0, 0.09257287799820409, 4.188565636774113, 0.05402495301926442], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 308.00000000000006, 117, 1433, 223.5, 862.5, 1433.0, 1433.0, 0.07704881042140195, 0.13354016410020747, 0.04980547755127873], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c30ae77-2b65-4b5c-95e5-73e8a0107f89", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.2548153208744711, 0.9724303596614952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 158.1875, 110, 345, 116.0, 344.3, 345.0, 345.0, 0.0965029734978709, 0.07171754182800757, 0.04843996911904848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 141.75000000000003, 109, 338, 115.0, 330.3, 338.0, 338.0, 0.09650530176001544, 0.05300016511453973, 0.05351850413766481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 832.6, 768, 910, 798.0, 910.0, 910.0, 910.0, 0.03173494970010472, 9.33112891133255, 0.018098838500840975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 900.6, 792, 1105, 796.0, 1105.0, 1105.0, 1105.0, 0.03175732323873886, 28.57529527363698, 0.018080585398617923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 202.8, 108, 340, 118.0, 340.0, 340.0, 340.0, 0.03184956811985629, 0.05635880608708946, 0.01763545422261574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8eb4ed5-de1a-459d-8308-274981c5f8eb", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 21, 0, 0.0, 126.47619047619047, 113, 326, 116.0, 122.4, 305.6999999999997, 326.0, 0.10837143535385854, 0.08053775615652964, 0.05439738063660478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 21, 0, 0.0, 167.04761904761904, 113, 341, 115.0, 339.6, 340.9, 341.0, 0.10837311314669075, 0.03674929041414011, 0.06137312927364211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 21, 0, 0.0, 188.09523809523807, 108, 1019, 115.0, 337.4, 950.8999999999991, 1019.0, 0.10837367242251282, 4.671382036870272, 0.06326837256288254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 21, 0, 0.0, 188.71428571428572, 110, 569, 115.0, 341.8, 546.2999999999997, 569.0, 0.10837367242251282, 1.545221898319692, 0.06337420622735765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cca91bd-74a1-43d9-acc6-d5550d106fd0", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 159.8, 109, 343, 115.0, 343.0, 343.0, 343.0, 0.03189507795157051, 0.02370327570424332, 0.017909833810696333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc2202ca-2208-4f0b-a66a-82ed48f755b1", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 741.3076923076923, 110, 1025, 798.0, 1022.6, 1025.0, 1025.0, 0.06213703606337977, 43.0123374130679, 0.03242216440025811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 280.625, 110, 1027, 115.5, 1018.6, 1027.0, 1027.0, 0.09650471968394705, 16.30271829480684, 0.055179212280225584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 635.5384615384614, 114, 1011, 759.0, 971.0, 1011.0, 1011.0, 0.06213584808263111, 14.057712851127288, 0.03248222406903771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 253.25, 110, 798, 114.5, 794.5, 798.0, 798.0, 0.09650646593321752, 5.341654094437608, 0.05527445534163289], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 470.64285714285717, 117, 1161, 413.5, 957.0, 1161.0, 1161.0, 0.07769749037106101, 0.014671254634100317, 0.053173136023331444], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 21, 0, 0.0, 360.6190476190476, 231, 1139, 234.0, 626.4000000000001, 1091.8999999999994, 1139.0, 0.10830660051368272, 6.329972820200728, 0.2422644992238027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8eb4ed5-de1a-459d-8308-274981c5f8eb", 3, 0, 0.0, 355.0, 196, 576, 293.0, 576.0, 576.0, 576.0, 0.046477040342071015, 0.030424911499969013, 0.02980461245894528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 486.9523809523809, 148, 833, 519.0, 791.0, 829.4, 833.0, 0.09766760458572657, 0.05999308914494338, 0.04416025480780411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ecc5a1d-3c71-4b8c-bcc6-c6bf47b1b68a", 3, 0, 0.0, 379.0, 194, 548, 395.0, 548.0, 548.0, 548.0, 0.02263672582397682, 0.02675584357645177, 0.014516389932693469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 133.76923076923075, 114, 341, 116.0, 252.5999999999999, 341.0, 341.0, 0.06213525410929113, 0.04617668786833062, 0.031188984972827776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 252.76923076923075, 113, 350, 336.0, 347.2, 350.0, 350.0, 0.06213525410929113, 0.08841391100797721, 0.03142236558471664], "isController": false}, {"data": ["login", 21, 0, 0.0, 2310.428571428571, 1365, 3435, 2270.0, 3115.8, 3407.8999999999996, 3435.0, 0.09269395105759384, 26.530845946791466, 0.1764521431613934], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 119.625, 111, 150, 117.5, 134.60000000000002, 150.0, 150.0, 0.10347749041216378, 0.08377230424969119, 0.03678301416994884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c30ae77-2b65-4b5c-95e5-73e8a0107f89", 3, 0, 0.0, 505.33333333333337, 216, 945, 355.0, 945.0, 945.0, 945.0, 0.04027169973420678, 0.025890822583026822, 0.025825276196740677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5322d901-cd72-42c4-b524-b8b6ecddeaa6", 3, 0, 0.0, 354.0, 203, 439, 420.0, 439.0, 439.0, 439.0, 0.02425614489003881, 0.029096319635349286, 0.015554884581177231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20faeffd-f41a-4ec8-ab93-67392cc84f63", 3, 0, 0.0, 389.3333333333333, 289, 587, 292.0, 587.0, 587.0, 587.0, 0.061552350273907964, 0.0395722304007058, 0.03947204753893186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 919.8461538461537, 232, 1140, 1029.0, 1139.2, 1140.0, 1140.0, 0.062100526421385506, 57.17130180169153, 0.1274432302663635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd8788a3-2d80-45f9-8909-fb71cb5aa28e", 3, 0, 0.0, 331.0, 231, 442, 320.0, 442.0, 442.0, 442.0, 0.029207882233818833, 0.029293452201300724, 0.0187303151043695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=603e5c0e-6aee-4cdc-a607-3c708db19abc", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 0.5884822882736156, 2.2457756514657983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e40c9d9a-84d4-4741-a60c-b2bfe3662a4e", 1, 0, 0.0, 753.0, 753, 753, 753.0, 753.0, 753.0, 753.0, 1.3280212483399734, 0.23992571381142097, 0.9156083997343958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 379.25, 222, 1128, 241.0, 653.6000000000004, 1105.1499999999996, 1128.0, 0.09252020409957024, 5.670535300216497, 0.20689649938242763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 806.8571428571429, 115, 1250, 910.0, 1250.0, 1250.0, 1250.0, 0.04439624280939425, 37.941494869062794, 0.07991075958800287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82d2fb94-3aae-4d3c-8dfb-0bff4885c706", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["register", 24, 6, 25.0, 952.5000000000001, 341, 1857, 913.5, 1546.5, 1791.25, 1857.0, 0.09664676011871444, 0.03048525734213356, 0.04360429997543561], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 23, 0, 0.0, 130.91304347826085, 115, 344, 118.0, 144.0, 304.3999999999994, 344.0, 0.10809438990116413, 0.0839209374720952, 0.038424177660179436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 468.56250000000006, 228, 1371, 236.5, 1358.4, 1371.0, 1371.0, 0.09643608397172011, 21.75351195920452, 0.2122606237907819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 11, 0, 0.0, 345.5454545454545, 229, 576, 238.0, 553.2, 576.0, 576.0, 0.0790377513041229, 0.12249307746058889, 0.17775775513026856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50702969-09f4-4117-a819-4f656ab76ace", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 115.375, 109, 123, 116.0, 123.0, 123.0, 123.0, 0.038099592334362026, 0.02831424781879834, 0.019124209433459063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 142.125, 112, 323, 115.0, 323.0, 323.0, 323.0, 0.038063699601282745, 0.010185013369874485, 0.021708203678856567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 115.25, 107, 122, 114.5, 122.0, 122.0, 122.0, 0.038101951296180755, 0.010269666560298719, 0.022399779961231266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 114.625, 110, 119, 114.0, 119.0, 119.0, 119.0, 0.038101769827208476, 0.010269617648739784, 0.022436882036920614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 2.520699786324786, 5.2834535256410255], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1069.9999999999998, 864, 1840, 916.0, 1479.0, 1489.0, 1840.0, 0.26339285714285715, 315.1094273158482, 0.5200980050223214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 952.5000000000001, 341, 1857, 913.5, 1546.5, 1791.25, 1857.0, 0.09559239403184819, 0.03015267897684274, 0.043128599651087764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 112.85714285714286, 110, 117, 113.0, 117.0, 117.0, 117.0, 0.03977543923449326, 0.010720723856172011, 0.023422451033593198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 150.28571428571428, 114, 342, 116.0, 342.0, 342.0, 342.0, 0.03977204934006807, 0.010719810173690222, 0.023381614944063454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebadb1f7-bcf7-477c-9665-1cfff7cba694", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 0.6383889134275619, 2.4362301236749118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 23, 0, 0.0, 192.52173913043475, 111, 794, 115.0, 341.6, 703.5999999999988, 794.0, 0.1110006466994199, 4.37116418111686, 0.06484149529936392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 23, 0, 0.0, 195.39130434782612, 109, 609, 116.0, 343.2, 555.9999999999993, 609.0, 0.11100118240389953, 1.4476624146376775, 0.06495020782558336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 23, 0, 0.0, 151.08695652173913, 108, 429, 117.0, 347.4, 412.9999999999998, 429.0, 0.11110735385759901, 0.08257099246643833, 0.055770683479302634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 145.2857142857143, 109, 341, 114.0, 341.0, 341.0, 341.0, 0.03977521322355375, 0.010642976975833716, 0.022684301291557993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 23, 0, 0.0, 163.34782608695653, 107, 350, 114.0, 342.2, 348.59999999999997, 350.0, 0.11112238439648467, 0.03699046763198199, 0.0629687220684224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 115.0, 110, 118, 116.0, 118.0, 118.0, 118.0, 0.03977543923449326, 0.029559677009227903, 0.0199654060220015], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 508.2857142857143, 115, 1035, 437.5, 990.0, 1035.0, 1035.0, 0.07947365732094301, 0.014851417966155576, 0.05408931881141469], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 117.57142857142857, 115, 122, 117.0, 122.0, 122.0, 122.0, 0.040880448049710624, 0.0321773839141277, 0.014531721767670574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/285873f8-aec9-44e3-8dea-4c0921668519", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1276.0, 817, 2028, 1175.0, 1834.8, 2008.6999999999998, 2028.0, 0.09524155071385809, 0.04929494324057109, 0.043807392955299965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 297.85714285714283, 229, 458, 233.0, 458.0, 458.0, 458.0, 0.0397456279809221, 0.06159796055246423, 0.0893888488672496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fd9f390-4305-4ae0-961e-9df7aca118ff", 3, 0, 0.0, 344.3333333333333, 269, 478, 286.0, 478.0, 478.0, 478.0, 0.05709391949757351, 0.036705888999904845, 0.03661296269863926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=133ef899-9597-4076-bb31-ad56551b74e1", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 0.6145036139455783, 2.345078656462585], "isController": false}, {"data": ["addBook", 60, 15, 25.0, 1058.5500000000002, 579, 2570, 904.0, 1694.1, 1830.4999999999998, 2570.0, 0.28667122155385355, 92.5684470467489, 1.0404336320288199], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 195.8644067796611, 110, 467, 117.0, 452.0, 465.0, 467.0, 0.2645977217687685, 0.1966395178379227, 0.12790612526908243], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 622.8135593220339, 538, 918, 571.0, 796.0, 832.0, 918.0, 0.2645277283345065, 77.77993527757478, 0.13303884774635827], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 189.01694915254234, 108, 466, 117.0, 343.0, 439.0, 466.0, 0.26481149012567323, 0.4685922071364452, 0.1287852754712747], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 863.9661016949156, 748, 1193, 794.0, 1022.0, 1034.0, 1193.0, 0.2639903710630758, 237.53899992812975, 0.13251079172502048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 11, 0, 0.0, 118.99999999999999, 116, 126, 118.0, 125.0, 126.0, 126.0, 0.08611376411091452, 0.06433303666489221, 0.030610752086301648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 15, 8.379888268156424, 173.38547486033522, 111, 1418, 120.0, 315.0, 348.0, 1226.7999999999972, 0.7459048158781882, 1.6322894029948702, 0.35637367070594267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 206.50000000000003, 111, 344, 138.5, 344.0, 344.0, 344.0, 0.038458764992909164, 0.02978300843689157, 0.013670889118573181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5322d901-cd72-42c4-b524-b8b6ecddeaa6", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 119.1, 112, 135, 117.0, 129.8, 134.75, 135.0, 0.09143358721392716, 0.07420049899880223, 0.032501782954950674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cca91bd-74a1-43d9-acc6-d5550d106fd0", 3, 0, 0.0, 507.6666666666667, 197, 1035, 291.0, 1035.0, 1035.0, 1035.0, 0.08023535704733886, 0.03630440960149773, 0.05145301216902915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/133ef899-9597-4076-bb31-ad56551b74e1", 3, 0, 0.0, 269.3333333333333, 191, 394, 223.0, 394.0, 394.0, 394.0, 0.08005764150188135, 0.0362239979451872, 0.05133904744749553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 259.875, 224, 439, 233.5, 439.0, 439.0, 439.0, 0.03804107485056991, 0.0589562361209516, 0.08555526892662352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 23, 0, 0.0, 376.4347826086957, 224, 910, 238.0, 736.8000000000001, 881.5999999999996, 910.0, 0.11092462912591391, 5.934194491265891, 0.2482381295575554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ecc5a1d-3c71-4b8c-bcc6-c6bf47b1b68a", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebadb1f7-bcf7-477c-9665-1cfff7cba694", 3, 0, 0.0, 294.3333333333333, 212, 433, 238.0, 433.0, 433.0, 433.0, 0.07050528789659224, 0.031901806698002355, 0.04521335193889542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 21, 0, 0.0, 151.19047619047623, 114, 367, 118.0, 329.6, 363.29999999999995, 367.0, 0.10559396605908235, 0.08754812225015714, 0.03753535512256442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 120.84615384615385, 116, 132, 117.0, 130.8, 132.0, 132.0, 0.059716027322379274, 0.04636156418094875, 0.021227181587252005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20faeffd-f41a-4ec8-ab93-67392cc84f63", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd8788a3-2d80-45f9-8909-fb71cb5aa28e", 1, 0, 0.0, 1161.0, 1161, 1161, 1161.0, 1161.0, 1161.0, 1161.0, 0.8613264427217916, 0.15561073428079242, 0.5938442075796727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82d2fb94-3aae-4d3c-8dfb-0bff4885c706", 3, 0, 0.0, 601.6666666666666, 239, 1159, 407.0, 1159.0, 1159.0, 1159.0, 0.01599624621422173, 0.02205211676993132, 0.010258009453781513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 11, 0, 0.0, 115.99999999999999, 109, 122, 115.0, 121.6, 122.0, 122.0, 0.07910425221312124, 0.0587874374357278, 0.03970662659916437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 11, 0, 0.0, 133.1818181818182, 109, 328, 115.0, 285.60000000000014, 328.0, 328.0, 0.07910652772683796, 0.021167176364407816, 0.04511544159421228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 11, 0, 0.0, 196.63636363636365, 111, 342, 115.0, 342.0, 342.0, 342.0, 0.07910709662572275, 0.021321834637401837, 0.04650632047723154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e40c9d9a-84d4-4741-a60c-b2bfe3662a4e", 3, 0, 0.0, 469.3333333333333, 202, 750, 456.0, 750.0, 750.0, 750.0, 0.03143665513989312, 0.03173342043906528, 0.020159573771350726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/603e5c0e-6aee-4cdc-a607-3c708db19abc", 3, 0, 0.0, 717.6666666666666, 287, 1433, 433.0, 1433.0, 1433.0, 1433.0, 0.07427213309566251, 0.033606206055654585, 0.04762893951772628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 11, 0, 0.0, 185.63636363636365, 108, 458, 114.0, 435.0000000000001, 458.0, 458.0, 0.07910766553279014, 0.02132198797563484, 0.046583908511984816], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 24.0, 0.44411547002220575], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.0, 0.07401924500370097], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07401924500370097], "isController": false}, {"data": ["401/Unauthorized", 17, 68.0, 1.2583271650629164], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 25, "401/Unauthorized", 17, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
