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

    var data = {"OkPercent": 98.04075235109718, "KoPercent": 1.9592476489028212};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7654986522911051, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8774204c-7574-46a1-99b1-3a4a39e3a4d8"], "isController": false}, {"data": [0.02830188679245283, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1126453-88ee-4919-a21f-62a3e2b35d04"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d03f64e-3eff-4aaa-800f-b386218e226b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/290a4380-8f00-4556-82d7-776f54ffa30b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09f60103-a9c0-4e3d-aba4-816aca8d572a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a1b62f8-e660-4402-b6b7-2ec5e641bcf8"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e7cdc41-8593-450a-9af5-0205e3a214c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3ad5411-ce9a-4add-8af5-8c950c1bfbbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21da2d53-26ed-4d4c-a817-fb36e175cb0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9eda42eb-2a68-4a3b-9781-5520321db671"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ee8463fe-ccbe-4b2a-9a3b-7c2edd3acf44"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8505b35c-84a4-4270-864c-eb02fb60751e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/704434ff-8e40-438b-8207-ed28eb208fc9"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1126453-88ee-4919-a21f-62a3e2b35d04"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3018867924528302, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8774204c-7574-46a1-99b1-3a4a39e3a4d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.15789473684210525, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d03f64e-3eff-4aaa-800f-b386218e226b"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66d28191-921d-48e6-8d11-7f8d5aff6428"], "isController": false}, {"data": [0.27049180327868855, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.44339622641509435, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09f60103-a9c0-4e3d-aba4-816aca8d572a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=704434ff-8e40-438b-8207-ed28eb208fc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/66d28191-921d-48e6-8d11-7f8d5aff6428"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21da2d53-26ed-4d4c-a817-fb36e175cb0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9eda42eb-2a68-4a3b-9781-5520321db671"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a3ad5411-ce9a-4add-8af5-8c950c1bfbbc"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/5e7cdc41-8593-450a-9af5-0205e3a214c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8505b35c-84a4-4270-864c-eb02fb60751e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee8463fe-ccbe-4b2a-9a3b-7c2edd3acf44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1276, 25, 1.9592476489028212, 420.59326018808775, 115, 2978, 134.0, 1214.3, 1486.6499999999985, 2040.1200000000008, 5.015466976923349, 680.3993561895421, 3.6716259585791606], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8774204c-7574-46a1-99b1-3a4a39e3a4d8", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 0.2569901315789474, 0.9807299075391182], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2039.3773584905657, 1428, 2650, 2040.0, 2440.4, 2523.0, 2650.0, 0.22814244697840394, 274.53192965195365, 1.121774629429945], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1126453-88ee-4919-a21f-62a3e2b35d04", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 679.7142857142858, 179, 1415, 538.0, 1412.5, 1415.0, 1415.0, 0.07722646661334363, 0.014582313415340485, 0.052225906376699674], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 679.7142857142858, 179, 1415, 538.0, 1412.5, 1415.0, 1415.0, 0.07839009149243537, 0.014802035272741525, 0.053012830428233876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 207.71428571428572, 120, 367, 123.5, 365.0, 367.0, 367.0, 0.10271158586688578, 0.027483373562037797, 0.0585777013147083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 122.0, 118, 125, 122.0, 125.0, 125.0, 125.0, 0.10270781826585185, 0.07632875947296217, 0.051554510340476416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d03f64e-3eff-4aaa-800f-b386218e226b", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 136.7142857142857, 117, 363, 119.5, 242.5, 363.0, 363.0, 0.10271158586688578, 0.02768398212818406, 0.06048348269309778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 188.78571428571425, 118, 366, 122.0, 365.0, 366.0, 366.0, 0.10271158586688578, 0.02768398212818406, 0.06038317841002465], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 251.6428571428571, 129, 424, 236.5, 385.5, 424.0, 424.0, 0.07737243220240629, 0.15839868252709416, 0.050014671402043735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/290a4380-8f00-4556-82d7-776f54ffa30b", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09f60103-a9c0-4e3d-aba4-816aca8d572a", 3, 0, 0.0, 354.0, 219, 496, 347.0, 496.0, 496.0, 496.0, 0.02567438039161988, 0.025749598302923456, 0.016464365029782282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 135.6315789473684, 117, 359, 123.0, 134.0, 359.0, 359.0, 0.1218511107690729, 0.09055536649928173, 0.0611635458352573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 158.8947368421053, 116, 361, 122.0, 361.0, 361.0, 361.0, 0.12184954787404605, 0.051868727153209775, 0.06841511415378695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 763.0, 599, 951, 731.0, 951.0, 951.0, 951.0, 0.09572125969177755, 28.1452285943333, 0.05459103091796688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1234.6, 1063, 1325, 1290.0, 1325.0, 1325.0, 1325.0, 0.09464856986010942, 85.16494953456566, 0.05388683225433964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 312.4, 125, 366, 356.0, 366.0, 366.0, 366.0, 0.0963743952506698, 0.17053750409591178, 0.05336355674524392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 160.53846153846155, 119, 372, 121.0, 366.0, 372.0, 372.0, 0.059490577607746585, 0.04421125933544449, 0.029861481338263426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 173.76923076923077, 117, 359, 120.0, 356.6, 359.0, 359.0, 0.0594916665903953, 0.022792029718375604, 0.033544504914926915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 268.38461538461536, 118, 1067, 123.0, 786.5999999999997, 1067.0, 1067.0, 0.05942395333848341, 4.1278443860934235, 0.034541958453514474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 258.69230769230774, 118, 947, 124.0, 716.1999999999998, 947.0, 947.0, 0.05949139434099552, 1.3603740550020822, 0.03463925762748319], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 123.0, 118, 126, 124.0, 126.0, 126.0, 126.0, 0.09683354313934346, 0.0719632093057035, 0.05437430400890869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 768.3333333333334, 116, 1578, 1072.0, 1571.7, 1578.0, 1578.0, 0.08053835415398933, 40.26995484538873, 0.04350259624333321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 272.05263157894734, 116, 1328, 122.0, 1294.0, 1328.0, 1328.0, 0.12184954787404605, 11.570483850926697, 0.07053194943243762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 581.7777777777777, 120, 1072, 704.5, 1059.4, 1072.0, 1072.0, 0.08053799379857447, 13.165672385982809, 0.04358105198280066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 216.21052631578948, 119, 832, 122.0, 607.0, 832.0, 832.0, 0.12165995402534369, 3.7948200873390405, 0.07054101261101471], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 473.7692307692308, 123, 906, 491.0, 824.8, 906.0, 906.0, 0.07577347229022405, 0.014355521117483856, 0.05182673266244667], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 468.38461538461536, 244, 1188, 483.0, 1005.5999999999999, 1188.0, 1188.0, 0.059390832796531574, 5.5505087624321, 0.13240247482742393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 572.0526315789473, 164, 1270, 526.0, 955.0, 1270.0, 1270.0, 0.10659066938940376, 0.06547415141204586, 0.04819480461649799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 135.7222222222222, 117, 370, 122.5, 151.30000000000035, 370.0, 370.0, 0.08053691275167786, 0.059852139261744965, 0.04042575503355705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 241.94444444444446, 115, 372, 238.5, 371.1, 372.0, 372.0, 0.08053763344638432, 0.08875219241335493, 0.042173895292127894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a1b62f8-e660-4402-b6b7-2ec5e641bcf8", 2, 0, 0.0, 244.0, 230, 258, 244.0, 258.0, 258.0, 258.0, 0.014061137827272982, 0.02361145165429287, 0.008740150612362553], "isController": false}, {"data": ["login", 19, 0, 0.0, 3244.6315789473683, 1796, 6193, 3293.0, 4308.0, 6193.0, 6193.0, 0.10462382229368458, 33.081578317469976, 0.20350989693176874], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 140.6315789473684, 121, 363, 126.0, 149.0, 363.0, 363.0, 0.11874406279686016, 0.0961316680259737, 0.04220980357232138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e7cdc41-8593-450a-9af5-0205e3a214c8", 1, 0, 0.0, 906.0, 906, 906, 906.0, 906.0, 906.0, 906.0, 1.1037527593818985, 0.19940845750551875, 0.7609857891832229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3ad5411-ce9a-4add-8af5-8c950c1bfbbc", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21da2d53-26ed-4d4c-a817-fb36e175cb0e", 3, 0, 0.0, 410.3333333333333, 243, 498, 490.0, 498.0, 498.0, 498.0, 0.026162714643271388, 0.030923442991444793, 0.01677752208569161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9eda42eb-2a68-4a3b-9781-5520321db671", 3, 0, 0.0, 338.6666666666667, 227, 496, 293.0, 496.0, 496.0, 496.0, 0.1087863074301048, 0.050426986256663156, 0.06976205261631069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee8463fe-ccbe-4b2a-9a3b-7c2edd3acf44", 3, 0, 0.0, 856.6666666666666, 424, 1657, 489.0, 1657.0, 1657.0, 1657.0, 0.042083409317266826, 0.03508320679085948, 0.026987082146814986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 920.0000000000001, 242, 1699, 1196.0, 1698.1, 1699.0, 1699.0, 0.08049225485636605, 53.55362125711015, 0.16958746880925124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 347.85714285714283, 243, 486, 253.0, 485.5, 486.0, 486.0, 0.1026167265264238, 0.1590358837865572, 0.2307874230374551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1005.8571428571429, 122, 1444, 1308.0, 1444.0, 1444.0, 1444.0, 0.06490014648890206, 55.46434606148825, 0.11681664202006341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8505b35c-84a4-4270-864c-eb02fb60751e", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/704434ff-8e40-438b-8207-ed28eb208fc9", 3, 0, 0.0, 348.6666666666667, 243, 457, 346.0, 457.0, 457.0, 457.0, 0.016603481196557544, 0.02288923921465534, 0.010647414699615353], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 1433.5238095238096, 304, 2978, 1689.0, 2021.4, 2883.199999999999, 2978.0, 0.0878962656643702, 0.027467583020115687, 0.03965632298529202], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 133.0625, 121, 188, 125.5, 161.40000000000003, 188.0, 188.0, 0.07959327834764354, 0.06179360965466467, 0.028292923162638917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 466.15789473684214, 242, 1688, 252.0, 1428.0, 1688.0, 1688.0, 0.12156343371913728, 15.477213204268157, 0.27012499640108256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1126453-88ee-4919-a21f-62a3e2b35d04", 3, 0, 0.0, 365.0, 249, 476, 370.0, 476.0, 476.0, 476.0, 0.031720185668820115, 0.0264438136386225, 0.02034139510663269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 385.375, 238, 1293, 247.5, 732.3000000000006, 1293.0, 1293.0, 0.09397944199706314, 7.163551991556535, 0.20985912261380324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 123.75, 118, 130, 123.5, 129.1, 130.0, 130.0, 0.06072382803011902, 0.04512776672941462, 0.030480515241680835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 143.25, 119, 363, 122.0, 296.7000000000003, 363.0, 363.0, 0.060724135313614855, 0.01624845026946335, 0.034631733421045974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 142.16666666666669, 117, 359, 121.5, 293.60000000000025, 359.0, 359.0, 0.06072321347245696, 0.016366803631248168, 0.035698607920331145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 163.16666666666666, 119, 369, 122.0, 368.7, 369.0, 369.0, 0.06072352074973307, 0.01636688645207649, 0.035758088878993205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 2.3977388211382116, 5.025724085365853], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1430.056603773585, 941, 2152, 1426.0, 1934.6000000000001, 2016.5999999999997, 2152.0, 0.23118260808877414, 276.5747713527672, 0.45649534526904423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 1433.5238095238096, 304, 2978, 1689.0, 2021.4, 2883.199999999999, 2978.0, 0.08788118463836891, 0.02746287019949029, 0.039649518850514105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8774204c-7574-46a1-99b1-3a4a39e3a4d8", 3, 0, 0.0, 386.6666666666667, 300, 475, 385.0, 475.0, 475.0, 475.0, 0.02311835828831675, 0.023186087853614555, 0.014825249292963543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 160.0, 120, 348, 123.0, 348.0, 348.0, 348.0, 0.04858063575858663, 0.013093999481806552, 0.028607542346120837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 161.83333333333334, 118, 370, 121.0, 370.0, 370.0, 370.0, 0.04867127421395892, 0.013118429377981116, 0.028613385817190695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 136.375, 118, 357, 122.0, 194.60000000000016, 357.0, 357.0, 0.08190762867176542, 0.02207666554043677, 0.04815272701211209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 166.4375, 118, 366, 121.5, 360.4, 366.0, 366.0, 0.08200754469411185, 0.022103596030834834, 0.04829155219780219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 122.4375, 119, 128, 122.0, 126.6, 128.0, 128.0, 0.08200502280764696, 0.06094318589513607, 0.041162677463994664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 159.66666666666666, 117, 358, 120.0, 358.0, 358.0, 358.0, 0.048672063857747784, 0.013023579586936418, 0.02775828641887178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 135.9375, 117, 357, 121.5, 195.30000000000018, 357.0, 357.0, 0.08190720937018475, 0.02191657750725647, 0.04671270534393349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 164.5, 119, 366, 123.0, 366.0, 366.0, 366.0, 0.04866969500324465, 0.03616956825924724, 0.024429905499675535], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 541.7692307692307, 122, 1624, 488.0, 1191.1999999999996, 1624.0, 1624.0, 0.07430609538616306, 0.01392122910855549, 0.05057190686588321], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 169.0, 119, 358, 134.5, 358.0, 358.0, 358.0, 0.04884760361797918, 0.03844840675399533, 0.017363796598578535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1763.421052631579, 1009, 2813, 1558.0, 2536.0, 2813.0, 2813.0, 0.10562773450746898, 0.0546706047743736, 0.04858463179005654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d03f64e-3eff-4aaa-800f-b386218e226b", 3, 0, 0.0, 351.0, 208, 436, 409.0, 436.0, 436.0, 436.0, 0.035018910211514216, 0.029193824561096322, 0.022456788123920247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 366.6666666666667, 242, 737, 254.0, 737.0, 737.0, 737.0, 0.04853230229153354, 0.07521558958658567, 0.10915028532949389], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66d28191-921d-48e6-8d11-7f8d5aff6428", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["addBook", 61, 14, 22.950819672131146, 1203.229508196721, 611, 3827, 986.0, 2047.6000000000001, 2527.2, 3827.0, 0.281412042590098, 78.34863301072825, 1.0245427486805927], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 222.26415094339617, 119, 499, 124.0, 493.6, 494.6, 499.0, 0.23215983109277194, 0.17253284322421822, 0.11222569960050988], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 799.5094339622641, 576, 1226, 729.0, 1067.2, 1076.5, 1226.0, 0.23208663399937818, 68.2411763973367, 0.11672325831023414], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 173.86792452830193, 119, 375, 123.0, 366.2, 369.79999999999995, 375.0, 0.23257957073710173, 0.41155681853088705, 0.11310998654987954], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1204.3396226415093, 817, 1801, 1214.0, 1552.6, 1661.0, 1801.0, 0.23172539229360045, 208.50691531557283, 0.11631528480362366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 141.93750000000003, 120, 369, 125.5, 208.00000000000017, 369.0, 369.0, 0.09393364761966266, 0.07017503948148626, 0.033390476302301964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 14, 8.0, 202.38285714285715, 119, 2346, 128.0, 355.4, 447.9999999999996, 1241.7200000000132, 0.7262887475046794, 1.4932083247735017, 0.35152456438238483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 204.33333333333334, 122, 581, 127.5, 516.8000000000002, 581.0, 581.0, 0.060406231909592004, 0.04677943545342428, 0.021472527749112784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09f60103-a9c0-4e3d-aba4-816aca8d572a", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 125.71428571428572, 121, 138, 124.0, 135.0, 138.0, 138.0, 0.10113999219777203, 0.08207747413705914, 0.03595210660155178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=704434ff-8e40-438b-8207-ed28eb208fc9", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 308.58333333333337, 241, 495, 248.5, 494.4, 495.0, 495.0, 0.06068636276284781, 0.09405200947718699, 0.136485052190272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66d28191-921d-48e6-8d11-7f8d5aff6428", 3, 0, 0.0, 395.3333333333333, 212, 542, 432.0, 542.0, 542.0, 542.0, 0.01827774866877064, 0.021603680148537172, 0.011721082316887422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21da2d53-26ed-4d4c-a817-fb36e175cb0e", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 305.9375, 238, 490, 248.0, 485.1, 490.0, 490.0, 0.08185524922365411, 0.12685964894329987, 0.18409437398640177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9eda42eb-2a68-4a3b-9781-5520321db671", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 0.5681259827044025, 2.168091588050314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3ad5411-ce9a-4add-8af5-8c950c1bfbbc", 3, 0, 0.0, 1014.6666666666667, 220, 2336, 488.0, 2336.0, 2336.0, 2336.0, 0.08672525439407955, 0.03924091914315449, 0.05561482785037003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e7cdc41-8593-450a-9af5-0205e3a214c8", 3, 0, 0.0, 1552.3333333333333, 287, 2746, 1624.0, 2746.0, 2746.0, 2746.0, 0.03434380437769026, 0.028631016605229414, 0.02202385892709955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 181.6153846153846, 123, 372, 127.0, 367.6, 372.0, 372.0, 0.059323078046354144, 0.049184856700541665, 0.021087500399289947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 126.38888888888887, 121, 134, 125.5, 134.0, 134.0, 134.0, 0.08116370719741718, 0.06301283908393229, 0.02885116154283189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8505b35c-84a4-4270-864c-eb02fb60751e", 3, 0, 0.0, 312.0, 204, 452, 280.0, 452.0, 452.0, 452.0, 0.09038594799795126, 0.04089728766834382, 0.05796234295441535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 121.43750000000001, 118, 125, 122.0, 125.0, 125.0, 125.0, 0.09404683532399134, 0.06989222820464593, 0.047207102887237846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee8463fe-ccbe-4b2a-9a3b-7c2edd3acf44", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 195.50000000000003, 118, 369, 122.0, 363.4, 369.0, 369.0, 0.09404904657779033, 0.03399404625449672, 0.05314368122663469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 217.75000000000003, 118, 1173, 121.5, 609.5000000000006, 1173.0, 1173.0, 0.09404794093789309, 5.312795966298508, 0.05478476247016917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 200.87499999999997, 118, 937, 120.0, 533.8000000000004, 937.0, 937.0, 0.09404959940748751, 1.7521215348600718, 0.054877573873021286], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.54858934169279], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.0, 0.07836990595611286], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07836990595611286], "isController": false}, {"data": ["401/Unauthorized", 16, 64.0, 1.2539184952978057], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1276, 25, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
