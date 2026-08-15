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

    var data = {"OkPercent": 97.89473684210526, "KoPercent": 2.1052631578947367};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7186692506459949, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8f13b3de-a8ac-4280-979e-35470d9a83c7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ed76f73-62cb-4e9b-b636-68100a0c7f44"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3a42d79-0de1-45cc-8a81-349702af2925"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96614550-b78f-4b8e-ac60-f56cfad09650"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eedde80a-9289-4c0d-9c61-0f29b00183f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.62, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/61c54c2c-985e-4020-98e2-70de867f95f9"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f595fd1-832b-4f56-8e19-b60d9778539a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d38b6bc5-a7db-4fdf-aa11-dc64ca425ef5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff98aa95-615c-4f30-bac8-42a27eaf1786"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44d9ef88-74d9-4567-b582-c7a1a14dda70"], "isController": false}, {"data": [0.52, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e49079d-5505-4fed-805d-6352775c9934"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/249589db-b955-44fc-be31-3d5b3ab2b56d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e39323ca-3927-489f-91c0-783404a9d709"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/96614550-b78f-4b8e-ac60-f56cfad09650"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f3a42d79-0de1-45cc-8a81-349702af2925"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.21929824561403508, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f595fd1-832b-4f56-8e19-b60d9778539a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f13b3de-a8ac-4280-979e-35470d9a83c7"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2627118644067797, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bff2192b-92e5-4b6a-9b22-3c1852f0eab2"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8c99075-475f-45c2-94b7-b7d26417b72d"], "isController": false}, {"data": [0.9142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d8c99075-475f-45c2-94b7-b7d26417b72d"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d38b6bc5-a7db-4fdf-aa11-dc64ca425ef5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61c54c2c-985e-4020-98e2-70de867f95f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eedde80a-9289-4c0d-9c61-0f29b00183f1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ed76f73-62cb-4e9b-b636-68100a0c7f44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e49079d-5505-4fed-805d-6352775c9934"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff98aa95-615c-4f30-bac8-42a27eaf1786"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44d9ef88-74d9-4567-b582-c7a1a14dda70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 28, 2.1052631578947367, 477.27969924812066, 136, 2950, 153.0, 1353.0000000000036, 1642.0, 2160.4900000000066, 5.318191814782973, 759.2677669279944, 3.8914308197712777], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2308.684210526316, 1685, 3476, 2228.0, 2775.2000000000003, 2953.3999999999974, 3476.0, 0.25606238937655545, 308.1280575870837, 1.2590567680771063], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8f13b3de-a8ac-4280-979e-35470d9a83c7", 3, 0, 0.0, 515.0, 366, 666, 513.0, 666.0, 666.0, 666.0, 0.022948587514438488, 0.02712445353675981, 0.0147163793631002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ed76f73-62cb-4e9b-b636-68100a0c7f44", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3a42d79-0de1-45cc-8a81-349702af2925", 1, 0, 0.0, 1317.0, 1317, 1317, 1317.0, 1317.0, 1317.0, 1317.0, 0.7593014426727411, 0.13717848329536828, 0.5235027524677297], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 617.0714285714287, 141, 1118, 561.5, 1051.5, 1118.0, 1118.0, 0.08529875890305796, 0.016802713109809967, 0.05739340320723334], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 617.0714285714287, 141, 1118, 561.5, 1051.5, 1118.0, 1118.0, 0.08598769147616298, 0.016938423599936123, 0.057856952565504195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 218.64285714285717, 137, 422, 139.0, 420.5, 422.0, 422.0, 0.0652507259143258, 0.017459666895044208, 0.037213304623013935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 140.42857142857142, 138, 151, 139.5, 146.0, 151.0, 151.0, 0.06524890125510922, 0.048490638530408324, 0.0327518898878185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 158.92857142857144, 136, 418, 139.5, 280.0, 418.0, 418.0, 0.06525011768324797, 0.017586945781812927, 0.038423653284178245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 158.64285714285714, 137, 415, 139.0, 277.5, 415.0, 415.0, 0.06525011768324797, 0.017586945781812927, 0.0383599324661282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96614550-b78f-4b8e-ac60-f56cfad09650", 1, 0, 0.0, 784.0, 784, 784, 784.0, 784.0, 784.0, 784.0, 1.2755102040816326, 0.23043885522959182, 0.8794044961734694], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 324.28571428571433, 139, 570, 313.0, 535.5, 570.0, 570.0, 0.08477090662484635, 0.16303734915319917, 0.05479124028918989], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eedde80a-9289-4c0d-9c61-0f29b00183f1", 3, 0, 0.0, 437.6666666666667, 297, 570, 446.0, 570.0, 570.0, 570.0, 0.08625894936599672, 0.039029928261307106, 0.0553157976077518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 141.43749999999997, 138, 157, 140.0, 148.60000000000002, 157.0, 157.0, 0.09139253665697526, 0.0679196488241779, 0.04587476937664578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 156.625, 137, 416, 139.0, 224.9000000000002, 416.0, 416.0, 0.09139410279551712, 0.03303441630585036, 0.0516434694629454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1000.8571428571429, 819, 1101, 1095.0, 1101.0, 1101.0, 1101.0, 0.048970568688218384, 14.398973170249679, 0.027928527454999543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1371.4285714285713, 1223, 1516, 1367.0, 1516.0, 1516.0, 1516.0, 0.04892607270414404, 44.02376622205098, 0.027855371471207004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 220.71428571428572, 138, 430, 141.0, 430.0, 430.0, 430.0, 0.04930167696132636, 0.08724085806047202, 0.027298877770578166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 140.35714285714286, 138, 144, 140.0, 143.5, 144.0, 144.0, 0.07237049558281511, 0.053783151502463176, 0.036326596415592736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 198.14285714285714, 137, 420, 139.0, 419.0, 420.0, 420.0, 0.07237199203908087, 0.01936516193233219, 0.041274651709788314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 199.1428571428571, 138, 421, 139.5, 420.0, 421.0, 421.0, 0.07237236616281714, 0.01950661431732181, 0.04254703557618743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 217.85714285714283, 138, 415, 139.0, 415.0, 415.0, 415.0, 0.07226925459425976, 0.019478822527359076, 0.0425569926956432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 180.85714285714286, 138, 416, 139.0, 416.0, 416.0, 416.0, 0.04920671741988092, 0.03656866402004822, 0.027630725113702664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 25, 0, 0.0, 765.1199999999999, 137, 2243, 141.0, 1652.4, 2065.9999999999995, 2243.0, 0.12702219331761647, 45.738459001681775, 0.07030876872307129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 234.375, 137, 1661, 139.5, 597.7000000000011, 1661.0, 1661.0, 0.09139358074337253, 5.162850374785082, 0.05323854581388839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 25, 0, 0.0, 552.08, 137, 1247, 412.0, 1237.8, 1244.6, 1247.0, 0.12702090255972523, 14.959886798971638, 0.07043209811856639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 260.8125, 138, 1100, 140.0, 722.7000000000004, 1100.0, 1100.0, 0.09139410279551712, 1.7026502683273737, 0.05332810197297019], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 610.6428571428572, 142, 1496, 515.5, 1406.5, 1496.0, 1496.0, 0.08602309105544188, 0.016945396842952556, 0.05843281673394901], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 399.64285714285717, 279, 562, 284.5, 562.0, 562.0, 562.0, 0.07221520129987362, 0.11191945748330023, 0.16241368026719624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61c54c2c-985e-4020-98e2-70de867f95f9", 3, 0, 0.0, 861.3333333333333, 239, 1721, 624.0, 1721.0, 1721.0, 1721.0, 0.03628885932018871, 0.029709141012459174, 0.023271176061449135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 701.9090909090908, 277, 1689, 634.5, 1172.3999999999999, 1614.2999999999988, 1689.0, 0.09610554135814603, 0.05903357960378307, 0.04345397036017736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 25, 0, 0.0, 173.91999999999996, 138, 418, 140.0, 414.0, 416.8, 418.0, 0.1270189664720736, 0.09439593113793751, 0.06375756715492757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 25, 0, 0.0, 216.60000000000002, 138, 420, 140.0, 414.8, 418.8, 420.0, 0.12702154793539175, 0.11030035197670933, 0.06817484643094854], "isController": false}, {"data": ["login", 22, 0, 0.0, 2952.2272727272725, 1529, 5079, 2714.0, 4555.099999999999, 5025.299999999999, 5079.0, 0.09699876987923653, 37.054076917544435, 0.19752821231267115], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 143.8125, 140, 162, 142.5, 150.8, 162.0, 162.0, 0.09043175511080716, 0.07321086424497962, 0.03214566294954473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f595fd1-832b-4f56-8e19-b60d9778539a", 1, 0, 0.0, 1496.0, 1496, 1496, 1496.0, 1496.0, 1496.0, 1496.0, 0.6684491978609626, 0.1207647476604278, 0.46086438836898397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d38b6bc5-a7db-4fdf-aa11-dc64ca425ef5", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff98aa95-615c-4f30-bac8-42a27eaf1786", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44d9ef88-74d9-4567-b582-c7a1a14dda70", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 25, 0, 0.0, 962.48, 278, 2384, 830.0, 1793.4, 2206.9999999999995, 2384.0, 0.1269293257514216, 60.858669947260864, 0.2724766053386474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e49079d-5505-4fed-805d-6352775c9934", 3, 0, 0.0, 382.6666666666667, 271, 479, 398.0, 479.0, 479.0, 479.0, 0.02953395420268168, 0.02962047945913485, 0.018939417245860325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 380.42857142857144, 278, 566, 282.5, 563.5, 566.0, 566.0, 0.06520635482503738, 0.10105711436263116, 0.14665062027545028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 1039.1818181818182, 139, 1932, 1383.0, 1876.0000000000002, 1932.0, 1932.0, 0.07666092871230548, 58.3703552624243, 0.12847375277895867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/249589db-b955-44fc-be31-3d5b3ab2b56d", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e39323ca-3927-489f-91c0-783404a9d709", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1168.9583333333337, 367, 2219, 1186.5, 1850.5, 2146.0, 2219.0, 0.09833446008235511, 0.030729518775735973, 0.04436574273246881], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 456.125, 279, 1801, 283.5, 1031.7000000000007, 1801.0, 1801.0, 0.09131950984253091, 6.960799539763939, 0.20391940839226294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 144.91666666666666, 140, 161, 142.5, 158.9, 161.0, 161.0, 0.10861301183881829, 0.08432357852720757, 0.03860853155207994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96614550-b78f-4b8e-ac60-f56cfad09650", 3, 0, 0.0, 540.0, 271, 994, 355.0, 994.0, 994.0, 994.0, 0.039412491132189496, 0.032856572197115005, 0.025274286305473084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3a42d79-0de1-45cc-8a81-349702af2925", 3, 0, 0.0, 854.0, 445, 1616, 501.0, 1616.0, 1616.0, 1616.0, 0.027729251587499656, 0.02781048962925991, 0.01778210469641091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 488.45, 279, 1376, 285.0, 831.9, 1348.7999999999997, 1376.0, 0.12528894763548434, 7.678921671307578, 0.28017496210009335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 190.63636363636363, 138, 418, 140.0, 417.8, 418.0, 418.0, 0.05371933114549149, 0.03992227636886623, 0.02696458614138928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 214.54545454545456, 138, 420, 140.0, 418.8, 420.0, 420.0, 0.05364859196831807, 0.014355189647772607, 0.030596462606931395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 214.1818181818182, 138, 418, 139.0, 417.0, 418.0, 418.0, 0.05364806866952789, 0.014459831008583692, 0.031539196620171676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 189.0, 138, 417, 139.0, 415.6, 417.0, 417.0, 0.05372011818426001, 0.01447925060435133, 0.0316340149073328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 143.0, 142, 144, 143.0, 144.0, 144.0, 144.0, 2.758620689655172, 0.8135775862068966, 1.7052801724137931], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1614.859649122807, 1097, 2904, 1513.0, 2198.4, 2290.799999999997, 2904.0, 0.2608612081077494, 312.0806949262495, 0.515098987103388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1168.9583333333337, 367, 2219, 1186.5, 1850.5, 2146.0, 2219.0, 0.09829177093102785, 0.0307161784159462, 0.04434648258802233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 208.5, 138, 410, 143.0, 410.0, 410.0, 410.0, 0.02436602644932171, 0.006567405566418742, 0.014348353465762687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 140.5, 137, 144, 140.5, 144.0, 144.0, 144.0, 0.024366323304560768, 0.006567485578182394, 0.014324733036470295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 515.75, 137, 1507, 276.5, 1468.3000000000002, 1507.0, 1507.0, 0.10389970215418716, 23.393286821080384, 0.058849440673270074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 459.8333333333333, 137, 1103, 278.5, 1100.9, 1103.0, 1103.0, 0.10427075639744537, 7.685844294434549, 0.059161435026284924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 141.25, 139, 144, 141.0, 144.0, 144.0, 144.0, 0.024366471734892786, 0.00651993481968811, 0.013896503411306042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 140.33333333333331, 138, 148, 139.5, 146.20000000000002, 148.0, 148.0, 0.10514510023832889, 0.07814005984508622, 0.052777911643067436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 139.5, 139, 141, 139.0, 141.0, 141.0, 141.0, 0.02436662016703318, 0.018108396432726808, 0.012230901138530328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 139.0, 137, 145, 138.5, 143.5, 145.0, 145.0, 0.10514602153741008, 0.0676158742015474, 0.057758434682415205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 143.75, 141, 148, 143.0, 148.0, 148.0, 148.0, 0.024194914229029058, 0.019044043816989667, 0.008600535917350173], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 794.5, 140, 1906, 548.5, 1813.5, 1906.0, 1906.0, 0.08250776456998721, 0.015930628650231905, 0.056148559650167074], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1461.318181818182, 763, 2950, 1359.0, 2355.7999999999993, 2895.6999999999994, 2950.0, 0.09798725274921054, 0.05071605855183748, 0.04507030863757633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f595fd1-832b-4f56-8e19-b60d9778539a", 3, 0, 0.0, 481.66666666666663, 233, 979, 233.0, 979.0, 979.0, 979.0, 0.03441472032303951, 0.028690136310971413, 0.022069335623824165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f13b3de-a8ac-4280-979e-35470d9a83c7", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 350.75, 280, 550, 286.5, 550.0, 550.0, 550.0, 0.02434482003091792, 0.037729716200260485, 0.05475207083125388], "isController": false}, {"data": ["addBook", 59, 12, 20.338983050847457, 1391.118644067797, 699, 3315, 1135.0, 2359.0, 2862.0, 3315.0, 0.3029540588141659, 93.33446613493523, 1.100901232162938], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bff2192b-92e5-4b6a-9b22-3c1852f0eab2", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.7257634943181818, 1.3560901988636365], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 253.7192982456139, 138, 573, 141.0, 559.2, 560.5, 573.0, 0.26249136541561136, 0.1950741494934377, 0.12688791589914805], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 887.5087719298247, 681, 1236, 827.0, 1107.2, 1228.6, 1236.0, 0.26186669606924307, 76.99750343700039, 0.1317005356207619], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 228.98245614035088, 138, 562, 144.0, 419.2, 434.1999999999996, 562.0, 0.2626933907264625, 0.46484416405893547, 0.12775518416189285], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1356.8596491228068, 957, 2350, 1360.0, 1654.2, 1946.5999999999983, 2350.0, 0.2615638766519824, 235.3556359917057, 0.1312928052725771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 161.10000000000002, 139, 419, 145.5, 158.9, 405.99999999999983, 419.0, 0.12135554139740906, 0.09066112223536907, 0.04313810260611025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8c99075-475f-45c2-94b7-b7d26417b72d", 1, 0, 0.0, 961.0, 961, 961, 961.0, 961.0, 961.0, 961.0, 1.040582726326743, 0.18799590270551508, 0.7174330124869928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, 6.857142857142857, 212.09714285714296, 138, 1426, 145.0, 374.0, 420.1999999999999, 1133.4000000000035, 0.7418995171294, 1.6190300935641277, 0.3553996771677244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 172.0, 140, 426, 145.0, 372.8000000000002, 426.0, 426.0, 0.051403550583430296, 0.0398076324342385, 0.01827235587145374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 148.71428571428572, 140, 180, 144.0, 170.0, 180.0, 180.0, 0.06751575769559073, 0.05479061977054287, 0.023999741993354518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8c99075-475f-45c2-94b7-b7d26417b72d", 3, 0, 0.0, 866.6666666666666, 255, 1906, 439.0, 1906.0, 1906.0, 1906.0, 0.037561506967659544, 0.03131348285943232, 0.024087294507255632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 431.54545454545456, 278, 837, 283.0, 835.8, 837.0, 837.0, 0.053611201816932366, 0.0830868918783903, 0.12057284939882347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d38b6bc5-a7db-4fdf-aa11-dc64ca425ef5", 3, 0, 0.0, 622.0, 455, 902, 509.0, 902.0, 902.0, 902.0, 0.027131888108093444, 0.032068973216304454, 0.017399029808901068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61c54c2c-985e-4020-98e2-70de867f95f9", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eedde80a-9289-4c0d-9c61-0f29b00183f1", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 715.8333333333333, 277, 1656, 556.0, 1615.2, 1656.0, 1656.0, 0.10377391123871459, 31.15804084314141, 0.22675207655920301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ed76f73-62cb-4e9b-b636-68100a0c7f44", 3, 0, 0.0, 462.0, 239, 703, 444.0, 703.0, 703.0, 703.0, 0.01822611315986124, 0.025126168369795688, 0.011687969702124558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 142.92857142857142, 139, 156, 141.5, 152.0, 156.0, 156.0, 0.0718818672855353, 0.059597368481854957, 0.02555175751165513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e49079d-5505-4fed-805d-6352775c9934", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 25, 0, 0.0, 156.19999999999996, 140, 414, 143.0, 160.20000000000005, 341.0999999999998, 414.0, 0.1252712121743575, 0.09725645867052167, 0.044530001202603635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff98aa95-615c-4f30-bac8-42a27eaf1786", 3, 0, 0.0, 412.3333333333333, 234, 584, 419.0, 584.0, 584.0, 584.0, 0.0625782227784731, 0.028315016166040884, 0.04012991499791406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44d9ef88-74d9-4567-b582-c7a1a14dda70", 3, 0, 0.0, 453.6666666666667, 351, 651, 359.0, 651.0, 651.0, 651.0, 0.035486160397444996, 0.02923680728057724, 0.02275642447362195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 195.45000000000002, 138, 417, 140.5, 415.9, 416.95, 417.0, 0.12539892533120992, 0.0931919747822761, 0.06294438244164247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 209.04999999999998, 137, 424, 140.0, 414.9, 423.55, 424.0, 0.12540049783997642, 0.04297171356645286, 0.0709908873025726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 277.65000000000003, 138, 1235, 141.0, 420.5, 1194.2999999999993, 1235.0, 0.12539971158066338, 5.673853229434447, 0.07318248793027776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 242.4, 138, 1089, 140.0, 415.8, 1055.3499999999995, 1089.0, 0.12540049783997642, 1.8757048879546552, 0.07330540820997059], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 28.571428571428573, 0.6015037593984962], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.142857142857143, 0.15037593984962405], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.15037593984962405], "isController": false}, {"data": ["401/Unauthorized", 16, 57.142857142857146, 1.2030075187969924], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 28, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
