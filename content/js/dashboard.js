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

    var data = {"OkPercent": 98.84169884169884, "KoPercent": 1.1583011583011582};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8059800664451827, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fad2a950-f3cc-45e0-b9de-6504319ab4a1"], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/89bef9a2-1ebc-4bf9-a438-629e1d7a3a68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ec0efee-8f67-4a27-a051-cbe28f72b9f2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d411d6d0-6686-48df-8eda-22396c44218f"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb8fe66f-ecc3-4dee-8a5c-ea54ec9880d5"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc861d06-cd01-49ca-a24b-40d827eab68c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ca0bc55-555b-4c21-a7f2-8450dade5f30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66651545-3ecd-41b5-a9d6-7abd22667592"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/250024c2-776d-4a4a-bb6a-b9f26c9c39f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6114272-00f8-4a60-a1fd-fbdb31940d02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ac60ce1-f0f1-4619-899f-406f84c495d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=558253b9-5923-449d-a671-16027dc4e8a3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad593614-53f0-492a-b23e-d70a45971f76"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18874181-e485-4304-bb27-33ca11c07ab6"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a86ce8c-3ddd-47e6-9757-ad2ec12301b2"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26b4f36e-6224-4777-92ad-cd6201f04aa6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc861d06-cd01-49ca-a24b-40d827eab68c"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89bef9a2-1ebc-4bf9-a438-629e1d7a3a68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ca0bc55-555b-4c21-a7f2-8450dade5f30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66651545-3ecd-41b5-a9d6-7abd22667592"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18874181-e485-4304-bb27-33ca11c07ab6"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d411d6d0-6686-48df-8eda-22396c44218f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9ec0efee-8f67-4a27-a051-cbe28f72b9f2"], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fad2a950-f3cc-45e0-b9de-6504319ab4a1"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8245614035087719, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9479768786127167, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9081334-f2d2-4d13-8359-07631dbc2fa0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=250024c2-776d-4a4a-bb6a-b9f26c9c39f6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6114272-00f8-4a60-a1fd-fbdb31940d02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/558253b9-5923-449d-a671-16027dc4e8a3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ac60ce1-f0f1-4619-899f-406f84c495d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1295, 15, 1.1583011583011582, 330.10424710424735, 78, 3092, 101.0, 872.4000000000001, 1111.2000000000005, 2107.4799999999996, 5.092730962231206, 727.8483715550329, 3.715026800742477], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/fad2a950-f3cc-45e0-b9de-6504319ab4a1", 3, 0, 0.0, 655.0, 181, 961, 823.0, 961.0, 961.0, 961.0, 0.04510125231143918, 0.029524289843197982, 0.028922352556489322], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1368.4561403508771, 973, 1997, 1382.0, 1620.8, 1688.2999999999997, 1997.0, 0.24687080427909394, 297.06883638447965, 1.2138618159621466], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/89bef9a2-1ebc-4bf9-a438-629e1d7a3a68", 3, 0, 0.0, 552.3333333333334, 222, 853, 582.0, 853.0, 853.0, 853.0, 0.04270219489281749, 0.02745339678167791, 0.02738389451134455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ec0efee-8f67-4a27-a051-cbe28f72b9f2", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 0.5772014776357828, 2.2027256389776357], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 568.1538461538463, 92, 1355, 481.0, 1206.6, 1355.0, 1355.0, 0.07043169209431345, 0.013343504166305479, 0.04761228944987431], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 568.1538461538463, 92, 1355, 481.0, 1206.6, 1355.0, 1355.0, 0.07021940864454936, 0.01330328640336189, 0.047468784434517707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 102.29411764705883, 78, 286, 81.0, 244.39999999999998, 286.0, 286.0, 0.08219628472793031, 0.029255984614789527, 0.04647149783388614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 82.4705882352941, 80, 90, 82.0, 86.0, 90.0, 90.0, 0.0821931054489194, 0.061082962154909826, 0.04125708613353962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d411d6d0-6686-48df-8eda-22396c44218f", 3, 0, 0.0, 543.6666666666666, 226, 962, 443.0, 962.0, 962.0, 962.0, 0.03524063480130155, 0.02937866722855901, 0.02259897479119924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 123.4705882352941, 80, 631, 82.0, 315.7999999999997, 631.0, 631.0, 0.08219509246947902, 1.4425030974253596, 0.047986484648857734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 127.7058823529412, 79, 709, 81.0, 335.39999999999964, 709.0, 709.0, 0.08219548988511971, 4.371418490177638, 0.047906447631802886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb8fe66f-ecc3-4dee-8a5c-ea54ec9880d5", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 239.53846153846155, 80, 400, 218.0, 398.4, 400.0, 400.0, 0.07017771155880892, 0.12934798158104985, 0.04536352223283885], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc861d06-cd01-49ca-a24b-40d827eab68c", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ca0bc55-555b-4c21-a7f2-8450dade5f30", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66651545-3ecd-41b5-a9d6-7abd22667592", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 82.72222222222221, 79, 90, 82.5, 85.5, 90.0, 90.0, 0.10639618392353661, 0.07906982027911265, 0.05340589700849396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 106.88888888888891, 78, 240, 80.5, 237.3, 240.0, 240.0, 0.10640121533832632, 0.04622726412919472, 0.05968904983714703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 610.3333333333334, 557, 637, 637.0, 637.0, 637.0, 637.0, 0.03739669163934631, 10.995869028994901, 0.02132780070056469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 907.0, 874, 938, 909.0, 938.0, 938.0, 938.0, 0.037286534589475256, 33.55048936634642, 0.021228564126625073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 82.0, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.03765816429001808, 0.06663729852882105, 0.020851737453554932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/250024c2-776d-4a4a-bb6a-b9f26c9c39f6", 3, 0, 0.0, 540.3333333333334, 400, 708, 513.0, 708.0, 708.0, 708.0, 0.026579014981704778, 0.026656883189658993, 0.01704448551886667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 82.28571428571429, 79, 88, 82.0, 86.5, 88.0, 88.0, 0.08005901493100628, 0.059496982775874785, 0.04018587272904026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 92.92857142857142, 78, 248, 81.0, 165.5, 248.0, 248.0, 0.07998308928969304, 0.021401725063843642, 0.045615355610528055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 104.0, 79, 240, 81.5, 238.5, 240.0, 240.0, 0.08005764150188135, 0.02157803618605396, 0.04706513689856697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 104.78571428571428, 78, 248, 82.5, 244.5, 248.0, 248.0, 0.07998308928969304, 0.021557942035112576, 0.04709941683758291], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 135.33333333333334, 83, 239, 84.0, 239.0, 239.0, 239.0, 0.037656746206082815, 0.02798514049104397, 0.021145145574704708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 539.0555555555557, 80, 979, 718.0, 965.5, 979.0, 979.0, 0.08675869514922495, 43.38018541357388, 0.04686249831302537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 215.72222222222223, 80, 1108, 82.5, 974.8000000000002, 1108.0, 1108.0, 0.10640247326637858, 10.663395868185068, 0.06153702067163605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 381.8333333333333, 78, 725, 479.5, 715.1, 725.0, 725.0, 0.08675994967922919, 14.182785289609532, 0.04694790245771657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 162.50000000000003, 79, 623, 82.0, 498.8000000000002, 623.0, 623.0, 0.1064018442986345, 3.5016782304782175, 0.061640564964237164], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 540.923076923077, 87, 911, 546.0, 846.1999999999999, 911.0, 911.0, 0.07038402607457458, 0.013334473689909638, 0.04814051663228678], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a6114272-00f8-4a60-a1fd-fbdb31940d02", 3, 0, 0.0, 408.0, 199, 736, 289.0, 736.0, 736.0, 736.0, 0.031149089927422623, 0.031240347026819364, 0.019975165090176612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 199.57142857142858, 161, 333, 166.5, 328.5, 333.0, 333.0, 0.07994518044769301, 0.12389941540086798, 0.17979858454202832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 712.3999999999999, 132, 1659, 646.5, 1458.9000000000003, 1649.55, 1659.0, 0.10318373411615392, 0.06338141480377033, 0.04665436415603444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 91.66666666666666, 79, 241, 83.0, 102.40000000000022, 241.0, 241.0, 0.08675702249898783, 0.0644747012907517, 0.04354795855906225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 147.50000000000003, 79, 320, 82.0, 252.5000000000001, 320.0, 320.0, 0.08675869514922495, 0.09560778080897663, 0.04543158233400169], "isController": false}, {"data": ["login", 20, 0, 0.0, 3272.2, 2052, 4639, 3214.5, 4462.8, 4630.8, 4639.0, 0.10587108078492818, 19.14735877294094, 0.1860704922740579], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 97.05555555555554, 81, 253, 86.5, 115.30000000000021, 253.0, 253.0, 0.1017023849209264, 0.08233523154242968, 0.036152019639860554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ac60ce1-f0f1-4619-899f-406f84c495d5", 3, 0, 0.0, 333.0, 187, 445, 367.0, 445.0, 445.0, 445.0, 0.049179521647186114, 0.03161769376731529, 0.03153764897296766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=558253b9-5923-449d-a671-16027dc4e8a3", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 636.8333333333333, 161, 1065, 806.0, 1053.3, 1065.0, 1065.0, 0.08672274737663689, 57.698932346621184, 0.18271436477996514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad593614-53f0-492a-b23e-d70a45971f76", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18874181-e485-4304-bb27-33ca11c07ab6", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 233.1764705882353, 162, 791, 165.0, 453.3999999999997, 791.0, 791.0, 0.08216053201360965, 5.9017579031182335, 0.1835444008201554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 657.6, 80, 1178, 958.0, 1178.0, 1178.0, 1178.0, 0.043745680114088734, 31.405707280156086, 0.07077914337209201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a86ce8c-3ddd-47e6-9757-ad2ec12301b2", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.9337308114035087, 1.7446774488304093], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1536.0869565217392, 168, 3021, 1418.0, 2654.0000000000005, 2965.5999999999995, 3021.0, 0.09138770239396048, 0.0290708503029701, 0.04123156104102513], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 104.42105263157895, 83, 341, 88.0, 114.0, 341.0, 341.0, 0.1034762576449893, 0.08033557112086571, 0.03678257595974229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 326.83333333333337, 162, 1191, 189.0, 1056.9000000000003, 1191.0, 1191.0, 0.10634401105977716, 14.282545329134715, 0.23614693862178163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26b4f36e-6224-4777-92ad-cd6201f04aa6", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 1.7642869475138123, 3.296572859116022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc861d06-cd01-49ca-a24b-40d827eab68c", 3, 0, 0.0, 669.3333333333333, 238, 1458, 312.0, 1458.0, 1458.0, 1458.0, 0.07280493132068146, 0.03294233546085521, 0.04668805817114012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 340.6666666666667, 163, 823, 317.0, 806.2, 823.0, 823.0, 0.08302475798283049, 13.355045821017994, 0.18389227157121585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89bef9a2-1ebc-4bf9-a438-629e1d7a3a68", 1, 0, 0.0, 911.0, 911, 911, 911.0, 911.0, 911.0, 911.0, 1.0976948408342482, 0.19831400933040613, 0.7568091383095499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 107.42857142857142, 81, 244, 83.0, 244.0, 244.0, 244.0, 0.042275126523414384, 0.031417354769842136, 0.021220131868198235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 81.0, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.042276147797412705, 0.01131217235985457, 0.02411061554071193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 103.42857142857143, 81, 237, 81.0, 237.0, 237.0, 237.0, 0.042276147797412705, 0.011394742961021392, 0.024853750951213324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 138.42857142857142, 80, 319, 82.0, 319.0, 319.0, 319.0, 0.0422758924742872, 0.011394674143460222, 0.024894885900385917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ca0bc55-555b-4c21-a7f2-8450dade5f30", 3, 0, 0.0, 470.0, 396, 520, 494.0, 520.0, 520.0, 520.0, 0.023016372312838533, 0.027204572873670802, 0.014759848130303354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66651545-3ecd-41b5-a9d6-7abd22667592", 3, 0, 0.0, 287.6666666666667, 212, 416, 235.0, 416.0, 416.0, 416.0, 0.018355696690467885, 0.025304809727907388, 0.011771068515697179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18874181-e485-4304-bb27-33ca11c07ab6", 3, 0, 0.0, 298.3333333333333, 182, 495, 218.0, 495.0, 495.0, 495.0, 0.027497456485275112, 0.022511752298329073, 0.017633460050778635], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 950.1052631578946, 621, 1651, 886.0, 1273.2, 1294.2999999999995, 1651.0, 0.2444788525792519, 292.48170228587725, 0.48275023429223374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1536.0869565217392, 168, 3021, 1418.0, 2654.0000000000005, 2965.5999999999995, 3021.0, 0.09364973370901807, 0.029790412913891104, 0.042252125950748384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 80.71428571428571, 80, 83, 80.0, 83.0, 83.0, 83.0, 0.03396953418063057, 0.009155851009623083, 0.02000354405363304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 81.28571428571428, 79, 83, 82.0, 83.0, 83.0, 83.0, 0.033969204489758285, 0.009155762147630163, 0.019970176858236804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 209.05263157894734, 78, 861, 85.0, 714.0, 861.0, 861.0, 0.10032049758966805, 9.526146937188809, 0.05806997552707861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 178.4736842105263, 78, 614, 83.0, 473.0, 614.0, 614.0, 0.10031996789761027, 3.1291827486615205, 0.058167637636355955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 81.71428571428571, 80, 83, 82.0, 83.0, 83.0, 83.0, 0.033969204489758285, 0.009089416045111104, 0.01937306193556527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 124.89473684210526, 78, 248, 82.0, 246.0, 248.0, 248.0, 0.10040425925436626, 0.07461683719977805, 0.05039823169603931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 83.14285714285714, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.0339685451272122, 0.025244201993953597, 0.017050617378307688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 149.1578947368421, 78, 320, 82.0, 274.0, 320.0, 320.0, 0.10040425925436626, 0.04273992984912939, 0.05637418421539355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 86.28571428571428, 83, 95, 83.0, 95.0, 95.0, 95.0, 0.034597971570352506, 0.027232387779007928, 0.012298497706648742], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 686.3846153846155, 80, 1458, 708.0, 1259.6, 1458.0, 1458.0, 0.07240605314604301, 0.01356525665160992, 0.04927875912733997], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1964.6499999999996, 1329, 3092, 1897.5, 2864.8, 3080.8999999999996, 3092.0, 0.10451286553374721, 0.054093572981334, 0.0480718356117138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d411d6d0-6686-48df-8eda-22396c44218f", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 0.24120702603471295, 0.9204981642189586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 165.71428571428572, 162, 167, 166.0, 167.0, 167.0, 167.0, 0.03395503383376586, 0.05262367059979142, 0.07636566691324488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ec0efee-8f67-4a27-a051-cbe28f72b9f2", 3, 0, 0.0, 754.3333333333334, 180, 1187, 896.0, 1187.0, 1187.0, 1187.0, 0.05653976630229929, 0.02558277186204297, 0.03625759753109687], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 952.8275862068967, 416, 1805, 781.0, 1587.9, 1708.0, 1805.0, 0.27782168637763627, 98.50011840353122, 1.0075339672936814], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fad2a950-f3cc-45e0-b9de-6504319ab4a1", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.2684458580980683, 1.0244474368499257], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 155.9122807017544, 80, 592, 83.0, 329.0, 334.9, 592.0, 0.2452372347565698, 0.1822514996579586, 0.11854729609814653], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 512.8596491228071, 394, 729, 479.0, 692.4000000000001, 727.2, 729.0, 0.24537130705420984, 72.14731136811723, 0.12340451477824031], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 125.21052631578945, 78, 339, 86.0, 246.2, 252.49999999999997, 339.0, 0.24579984130817265, 0.4349505004398524, 0.11953937594870115], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 791.1403508771931, 540, 1060, 795.0, 961.6, 1031.4, 1060.0, 0.24513809445987905, 220.57568830180585, 0.12304783257068148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 93.06666666666666, 81, 192, 86.0, 133.80000000000004, 192.0, 192.0, 0.08425025696328374, 0.06294086579776569, 0.029948333529917267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 7, 4.046242774566474, 167.5549132947977, 80, 1476, 88.0, 316.6, 423.5999999999996, 1393.119999999999, 0.7031977205012621, 1.5500938507290087, 0.33691979836923164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 115.42857142857142, 83, 272, 85.0, 272.0, 272.0, 272.0, 0.03954288425797778, 0.030622565641187868, 0.014056259638578037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 98.88235294117646, 82, 243, 86.0, 143.7999999999999, 243.0, 243.0, 0.0837756193235858, 0.06798587857216777, 0.029779614681430887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9081334-f2d2-4d13-8359-07631dbc2fa0", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.703383122246696, 1.3142724394273126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=250024c2-776d-4a4a-bb6a-b9f26c9c39f6", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6114272-00f8-4a60-a1fd-fbdb31940d02", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 247.14285714285714, 163, 486, 169.0, 486.0, 486.0, 486.0, 0.04225394621676274, 0.0654853639121118, 0.09503011536836387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 366.7894736842106, 159, 1109, 323.0, 958.0, 1109.0, 1109.0, 0.1002760229473762, 12.766942648382125, 0.2228224352427999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/558253b9-5923-449d-a671-16027dc4e8a3", 3, 0, 0.0, 836.3333333333334, 195, 1895, 419.0, 1895.0, 1895.0, 1895.0, 0.033038192150125545, 0.02754258141161182, 0.02118660108585525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ac60ce1-f0f1-4619-899f-406f84c495d5", 1, 0, 0.0, 744.0, 744, 744, 744.0, 744.0, 744.0, 744.0, 1.3440860215053765, 0.24282804099462366, 0.9266843077956989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 87.21428571428571, 81, 127, 83.5, 108.0, 127.0, 127.0, 0.08316946967581729, 0.06895593726051649, 0.02956414742382568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 89.3888888888889, 82, 104, 85.5, 103.1, 104.0, 104.0, 0.08565799617394283, 0.06650205757644977, 0.03044874082745624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 92.6, 80, 240, 82.0, 148.80000000000007, 240.0, 240.0, 0.08313703755022864, 0.06178445857004295, 0.0417308958015796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 124.80000000000001, 79, 246, 82.0, 244.2, 246.0, 246.0, 0.08306337735692333, 0.03886024932857103, 0.04644194562117562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 219.86666666666662, 79, 742, 90.0, 725.2, 742.0, 742.0, 0.08313841992661648, 9.993833467509505, 0.04792366992384521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 207.7333333333333, 80, 707, 82.0, 667.4, 707.0, 707.0, 0.08313749833725004, 3.278778391455682, 0.04800432765319469], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 26.666666666666668, 0.3088803088803089], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07722007722007722], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.07722007722007722], "isController": false}, {"data": ["401/Unauthorized", 9, 60.0, 0.694980694980695], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1295, 15, "401/Unauthorized", 9, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
