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

    var data = {"OkPercent": 98.63234111021721, "KoPercent": 1.3676588897827835};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7342995169082126, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d61b46f8-a6e8-4919-8c2e-d602a7c1232c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a42dc11f-04c1-4008-b636-6d8758920e22"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3caf5e6-858f-4e57-aab9-158a96aef435"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c26ca413-b3d1-48a6-8c28-59936748d631"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4fe0580-cbda-4a4c-93f8-74cabebcb776"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d0d761d6-f735-42e0-8c97-501baae4837b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a21c2ea0-33fc-4f01-9c3d-41190be84043"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fac9b980-78be-4ab9-bd58-3cb94feba806"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d43ecec-2142-4c66-b38d-580d5e15aeb3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3caf5e6-858f-4e57-aab9-158a96aef435"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bf2acde-7489-4c3f-ad9d-f310c7713d7a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/162d9501-ae8b-4371-a107-8a61d5fda933"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3cde8321-e9dc-469b-8c37-c052d3574f31"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/31cb504e-72bd-4295-96b9-50c7f07b0d67"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c26ca413-b3d1-48a6-8c28-59936748d631"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed3e4981-abd6-4240-be01-080c98f5a4f3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a21c2ea0-33fc-4f01-9c3d-41190be84043"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4fe0580-cbda-4a4c-93f8-74cabebcb776"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d61b46f8-a6e8-4919-8c2e-d602a7c1232c"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "addBook"], "isController": true}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9711538461538461, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9548192771084337, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0d761d6-f735-42e0-8c97-501baae4837b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fac9b980-78be-4ab9-bd58-3cb94feba806"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=162d9501-ae8b-4371-a107-8a61d5fda933"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d43ecec-2142-4c66-b38d-580d5e15aeb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dffee7b7-1664-4ecb-a9e7-2651471d1258"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bf2acde-7489-4c3f-ad9d-f310c7713d7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cde8321-e9dc-469b-8c37-c052d3574f31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31cb504e-72bd-4295-96b9-50c7f07b0d67"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1243, 17, 1.3676588897827835, 490.0450522928394, 136, 2789, 165.0, 1387.2000000000003, 1708.3999999999999, 2104.519999999999, 4.823849921219507, 680.9480553551816, 3.5248692166191913], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2401.173076923077, 1751, 3263, 2365.0, 2897.9, 3031.85, 3263.0, 0.2352845359238764, 283.12585156317164, 1.1568922249772635], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d61b46f8-a6e8-4919-8c2e-d602a7c1232c", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a42dc11f-04c1-4008-b636-6d8758920e22", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.9310085641399416, 1.7395909256559765], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 558.6428571428571, 153, 952, 511.0, 858.5, 952.0, 952.0, 0.06895057228975, 0.013019614898741158, 0.04662917120180847], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 558.6428571428571, 153, 952, 511.0, 858.5, 952.0, 952.0, 0.06988294606534055, 0.013195670689095764, 0.04725970717797689], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3caf5e6-858f-4e57-aab9-158a96aef435", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 186.6, 137, 443, 150.0, 435.8, 443.0, 443.0, 0.09319780301712355, 0.043601524250068344, 0.0521082508015011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 167.6, 138, 444, 150.0, 270.0000000000001, 444.0, 444.0, 0.09319317080444345, 0.0692578154122866, 0.04677860331394916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 306.0, 138, 1214, 148.0, 1178.6, 1214.0, 1214.0, 0.09319432881444388, 3.6753998813325546, 0.0538112306155796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 396.93333333333334, 137, 1631, 152.0, 1607.0, 1631.0, 1631.0, 0.09319548685322332, 11.202764935353397, 0.053720888059794226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c26ca413-b3d1-48a6-8c28-59936748d631", 3, 0, 0.0, 467.0, 259, 770, 372.0, 770.0, 770.0, 770.0, 0.017188628003712746, 0.0236959113267329, 0.011022655327901728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4fe0580-cbda-4a4c-93f8-74cabebcb776", 3, 0, 0.0, 317.0, 233, 463, 255.0, 463.0, 463.0, 463.0, 0.09770713913496612, 0.044209936001823866, 0.06265724742704533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0d761d6-f735-42e0-8c97-501baae4837b", 3, 0, 0.0, 619.3333333333333, 233, 1389, 236.0, 1389.0, 1389.0, 1389.0, 0.02279548649367425, 0.02286227014551119, 0.014618199346529389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a21c2ea0-33fc-4f01-9c3d-41190be84043", 3, 0, 0.0, 833.0, 273, 1616, 610.0, 1616.0, 1616.0, 1616.0, 0.01941433425012134, 0.022947085827535997, 0.012449947419511406], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 259.57142857142856, 153, 444, 246.5, 392.0, 444.0, 444.0, 0.06924248719013987, 0.14665245804647162, 0.044759356081963325], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 161.77777777777777, 142, 415, 144.5, 183.70000000000036, 415.0, 415.0, 0.10025062656641605, 0.07450266290726816, 0.05032111528822055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 228.27777777777777, 138, 456, 151.0, 454.2, 456.0, 456.0, 0.10008228988279251, 0.03513088191957832, 0.05661121713964815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 956.6666666666667, 744, 1211, 871.5, 1211.0, 1211.0, 1211.0, 0.042921218104169795, 12.620263241195785, 0.024478507200034336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1578.0, 1326, 1783, 1593.5, 1783.0, 1783.0, 1783.0, 0.042692168121758065, 38.41448792078468, 0.024306185561508743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 291.83333333333337, 145, 452, 286.0, 452.0, 452.0, 452.0, 0.043049636230573854, 0.07617767661113264, 0.023837054436265014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 175.9090909090909, 147, 425, 152.0, 371.20000000000016, 425.0, 425.0, 0.06310704676232165, 0.046898889244264434, 0.031676779331868486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 308.3636363636364, 142, 470, 428.0, 466.6, 470.0, 470.0, 0.06300764110847624, 0.02546260496500212, 0.03545298555979425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 310.5454545454545, 145, 1640, 151.0, 1397.8000000000009, 1640.0, 1640.0, 0.06310740880979428, 5.177659233259325, 0.036607227375993937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 292.18181818181813, 139, 875, 149.0, 790.8000000000003, 875.0, 875.0, 0.06300764110847624, 1.6996512562864443, 0.03661088521439782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 245.83333333333334, 144, 446, 149.5, 446.0, 446.0, 446.0, 0.04314312011044639, 0.03206241641020478, 0.024225873108893233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1135.8750000000002, 143, 1911, 1625.5, 1831.2, 1911.0, 1911.0, 0.08524513303568575, 47.94844142926785, 0.045536218525898536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 283.5, 137, 1770, 149.5, 574.8000000000019, 1770.0, 1770.0, 0.10025621031525009, 5.0372272978862656, 0.058461032360476776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 728.7500000000001, 140, 1206, 879.5, 1203.9, 1206.0, 1206.0, 0.08524649556984619, 15.674428815180269, 0.04562019489480049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 216.9444444444444, 140, 851, 147.5, 480.2000000000006, 851.0, 851.0, 0.10025118491331057, 1.6631406155144277, 0.05855600351436098], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 478.0769230769231, 150, 838, 494.0, 786.0, 838.0, 838.0, 0.07140738462214508, 0.01352835216474233, 0.04884046251386951], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 622.5454545454546, 304, 1788, 582.0, 1606.4000000000005, 1788.0, 1788.0, 0.06295211061258127, 6.935294977136938, 0.1401165096917636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fac9b980-78be-4ab9-bd58-3cb94feba806", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 604.7619047619047, 183, 1053, 693.0, 948.0, 1042.8, 1053.0, 0.09118461845750361, 0.0560108642673533, 0.04122898275959393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 147.8125, 140, 157, 147.5, 155.6, 157.0, 157.0, 0.08524377054508063, 0.06335010682109997, 0.042788377011886175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 202.31249999999997, 138, 445, 147.5, 443.6, 445.0, 445.0, 0.08524649556984619, 0.10283274770766845, 0.04414253347256927], "isController": false}, {"data": ["login", 21, 0, 0.0, 2909.9999999999995, 1717, 4517, 2934.0, 4037.2000000000003, 4473.599999999999, 4517.0, 0.09231864880667157, 31.681318359761377, 0.1830273881405705], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 169.61111111111111, 139, 445, 152.5, 204.7000000000004, 445.0, 445.0, 0.09885873087358164, 0.08003309364667889, 0.03514118949021848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1285.625, 289, 2068, 1774.5, 1984.7, 2068.0, 2068.0, 0.08517615493542582, 63.73718572993303, 0.17794247016172823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d43ecec-2142-4c66-b38d-580d5e15aeb3", 3, 0, 0.0, 319.6666666666667, 244, 467, 248.0, 467.0, 467.0, 467.0, 0.025036302638826297, 0.02527264794368501, 0.01605518105419525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3caf5e6-858f-4e57-aab9-158a96aef435", 3, 0, 0.0, 586.6666666666666, 251, 1014, 495.0, 1014.0, 1014.0, 1014.0, 0.04244302024532066, 0.027286772455894625, 0.027217692019297423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bf2acde-7489-4c3f-ad9d-f310c7713d7a", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 0.679188204887218, 2.5919290413533833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/162d9501-ae8b-4371-a107-8a61d5fda933", 3, 0, 0.0, 442.3333333333333, 272, 611, 444.0, 611.0, 611.0, 611.0, 0.02340933564305445, 0.02347791768107121, 0.01501184609922437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cde8321-e9dc-469b-8c37-c052d3574f31", 3, 0, 0.0, 410.3333333333333, 235, 517, 479.0, 517.0, 517.0, 517.0, 0.023483365949119376, 0.027756543542074363, 0.015059319960861057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 589.6666666666665, 287, 1786, 305.0, 1759.0, 1786.0, 1786.0, 0.093106979919928, 14.976833577092581, 0.20622347420936657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1406.2500000000002, 150, 2057, 1742.5, 2057.0, 2057.0, 2057.0, 0.05686220156228899, 51.02402494651399, 0.10558239110888401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31cb504e-72bd-4295-96b9-50c7f07b0d67", 3, 0, 0.0, 744.6666666666667, 243, 1725, 266.0, 1725.0, 1725.0, 1725.0, 0.022370363742114447, 0.026441012613156758, 0.014345578311186673], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1139.9090909090908, 165, 2176, 1128.0, 2056.0, 2163.85, 2176.0, 0.0886107049787133, 0.02773804561034651, 0.03997865791031791], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 196.85, 146, 467, 154.5, 438.9000000000001, 465.75, 467.0, 0.09624268555589775, 0.07471966310247921, 0.03421126713119803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 513.0555555555555, 288, 1915, 310.0, 961.9000000000015, 1915.0, 1915.0, 0.09999722229938057, 6.792557628607539, 0.22347469514735702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c26ca413-b3d1-48a6-8c28-59936748d631", 1, 0, 0.0, 838.0, 838, 838, 838.0, 838.0, 838.0, 838.0, 1.1933174224343677, 0.2155895733890215, 0.8227364260143198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 550.3529411764706, 298, 1957, 307.0, 1080.1999999999991, 1957.0, 1957.0, 0.09564640088219739, 6.870475257120031, 0.21367146621712857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 150.16666666666666, 144, 155, 150.5, 155.0, 155.0, 155.0, 0.034936531966926754, 0.025963575026202397, 0.01753650139746128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 190.66666666666669, 139, 420, 146.0, 420.0, 420.0, 420.0, 0.034882301301691204, 0.009333740777991593, 0.019893812461120767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 149.33333333333334, 146, 154, 149.0, 154.0, 154.0, 154.0, 0.034936735394988906, 0.009416541961930603, 0.02053897920681965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 196.66666666666666, 148, 429, 150.5, 429.0, 429.0, 429.0, 0.03488047623476886, 0.009401378360152545, 0.02053996793902893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 1.9661458333333335, 4.12109375], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1670.038461538462, 1145, 2647, 1563.0, 2291.9, 2405.35, 2647.0, 0.25538142689461096, 305.52497151514854, 0.504278559746976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed3e4981-abd6-4240-be01-080c98f5a4f3", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1139.9090909090908, 165, 2176, 1128.0, 2056.0, 2163.85, 2176.0, 0.08596369206242527, 0.026909444088433196, 0.038784400129727024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 146.0, 139, 150, 146.5, 150.0, 150.0, 150.0, 0.038927419825734916, 0.010492156124905113, 0.02292308022941226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 194.0, 146, 425, 148.5, 425.0, 425.0, 425.0, 0.03892843008129554, 0.01049242842034919, 0.022885659090761637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a21c2ea0-33fc-4f01-9c3d-41190be84043", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 191.70000000000002, 138, 454, 148.5, 444.6, 453.6, 454.0, 0.10276858569872362, 0.0276993453641091, 0.06041668807678869], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4fe0580-cbda-4a4c-93f8-74cabebcb776", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 0.6975446428571428, 2.6619811776061777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 207.64999999999998, 139, 451, 149.0, 446.5, 450.8, 451.0, 0.10276805763232671, 0.027699203033713062, 0.060516737062786145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 152.15, 145, 185, 150.0, 155.9, 183.54999999999998, 185.0, 0.1027691137705474, 0.07637431208924471, 0.0515852778106068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 189.16666666666666, 143, 413, 144.0, 413.0, 413.0, 413.0, 0.038928935228739935, 0.010416531496752677, 0.022201658372640744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 190.8, 138, 444, 149.0, 426.40000000000003, 443.15, 444.0, 0.10277175421107264, 0.027499473294759668, 0.05861201607350236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 198.33333333333334, 144, 447, 149.5, 447.0, 447.0, 447.0, 0.03892767238470921, 0.028929647153089558, 0.01953986680248099], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 665.4615384615385, 150, 1725, 501.0, 1590.6, 1725.0, 1725.0, 0.07221058829410817, 0.013528636358586673, 0.04914572791050331], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 252.66666666666666, 151, 444, 171.5, 444.0, 444.0, 444.0, 0.040062764998497646, 0.03153377791873936, 0.014241060995559711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d61b46f8-a6e8-4919-8c2e-d602a7c1232c", 3, 0, 0.0, 331.6666666666667, 247, 501, 247.0, 501.0, 501.0, 501.0, 0.05942712253872667, 0.038205913741531636, 0.038109189909274595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1463.142857142857, 1037, 2789, 1414.0, 2020.2000000000003, 2721.2999999999993, 2789.0, 0.0911668048639661, 0.04718594392373245, 0.04193316903410941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 393.8333333333333, 294, 872, 299.5, 872.0, 872.0, 872.0, 0.03888957305730378, 0.06027124261908312, 0.08746356128024475], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 1473.7894736842104, 736, 2907, 1161.0, 2666.4, 2776.0, 2907.0, 0.2702215816969915, 86.10201349893097, 0.9825948931084015], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 269.673076923077, 139, 611, 153.0, 597.1, 605.4, 611.0, 0.257606832525835, 0.19144414018765665, 0.12452674033231281], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 960.826923076923, 705, 1478, 883.5, 1319.3000000000002, 1371.8, 1478.0, 0.25725254284244276, 75.64078918401472, 0.12937994098033007], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 256.8653846153846, 139, 599, 151.5, 454.7, 547.1999999999996, 599.0, 0.2578175742341083, 0.45621625440644936, 0.1253839374693222], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1396.346153846154, 995, 2062, 1342.5, 1739.0000000000002, 1802.05, 2062.0, 0.2561689927139627, 230.5013099410811, 0.1285848264208758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 154.88235294117646, 146, 167, 154.0, 166.2, 167.0, 167.0, 0.09083671299339029, 0.06786141156244489, 0.03228961282186921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 6, 3.6144578313253013, 213.9759036144577, 139, 792, 156.0, 376.60000000000025, 443.3, 691.5000000000018, 0.720123548907668, 1.5126475087412588, 0.3479964514393795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 151.33333333333331, 147, 156, 150.5, 156.0, 156.0, 156.0, 0.03489041502148668, 0.027019628039100522, 0.012402452214669093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 153.06666666666663, 141, 165, 154.0, 163.8, 165.0, 165.0, 0.09263833992094861, 0.07517818405694171, 0.032930034893774704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 347.66666666666663, 292, 584, 301.5, 584.0, 584.0, 584.0, 0.034849479290696934, 0.054009886361656274, 0.07837729570944826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 421.54999999999995, 290, 629, 309.0, 608.1, 628.0, 629.0, 0.10268838183647902, 0.15914693552196504, 0.2309485775091906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0d761d6-f735-42e0-8c97-501baae4837b", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fac9b980-78be-4ab9-bd58-3cb94feba806", 3, 0, 0.0, 438.6666666666667, 246, 577, 493.0, 577.0, 577.0, 577.0, 0.03491538837550336, 0.02910752266590629, 0.022390402050697145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=162d9501-ae8b-4371-a107-8a61d5fda933", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 153.0, 145, 158, 154.0, 157.8, 158.0, 158.0, 0.06283236895167048, 0.05209441527340649, 0.02233494365078912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d43ecec-2142-4c66-b38d-580d5e15aeb3", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 171.5625, 141, 430, 155.5, 251.50000000000017, 430.0, 430.0, 0.08534607834769993, 0.06625989481095844, 0.030337863787658955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dffee7b7-1664-4ecb-a9e7-2651471d1258", 2, 0, 0.0, 231.5, 226, 237, 231.5, 237.0, 237.0, 237.0, 0.01877740327290139, 0.02638738604463389, 0.011671696467970444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bf2acde-7489-4c3f-ad9d-f310c7713d7a", 3, 0, 0.0, 381.3333333333333, 340, 460, 344.0, 460.0, 460.0, 460.0, 0.07222824124232574, 0.03268139821837005, 0.046318240640423745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cde8321-e9dc-469b-8c37-c052d3574f31", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 182.05882352941177, 138, 434, 150.0, 430.8, 434.0, 434.0, 0.09572664973618861, 0.07114060590746049, 0.0480502909808603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 180.1764705882353, 136, 444, 147.0, 433.59999999999997, 444.0, 444.0, 0.09572826686788373, 0.03407240013289336, 0.05412210492381156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 328.47058823529414, 137, 1807, 149.0, 725.3999999999991, 1807.0, 1807.0, 0.09573419681824581, 5.091450135506125, 0.05579728635787696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31cb504e-72bd-4295-96b9-50c7f07b0d67", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.255175229519774, 0.9738038488700566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 294.70588235294116, 139, 874, 153.0, 540.3999999999997, 874.0, 874.0, 0.09572934498603478, 1.6800258082090729, 0.055887944226394266], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 41.1764705882353, 0.5631536604987932], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.08045052292839903], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.08045052292839903], "isController": false}, {"data": ["401/Unauthorized", 8, 47.05882352941177, 0.6436041834271923], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1243, 17, "401/Unauthorized", 8, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
