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

    var data = {"OkPercent": 98.0377358490566, "KoPercent": 1.9622641509433962};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7660818713450293, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.08620689655172414, 500, 1500, "see books"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=599d38fd-ce19-4451-a593-66d1c31af088"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f8418f1-06df-41c0-b82d-2351a48168e3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98da3e53-2f85-4a94-ad21-de449d72eae6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a5c67406-572a-41fe-83d8-a5f8e1191573"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2eeb2702-58d1-4bd7-b91f-bc3994ad0b3e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f7cc5206-0f09-427a-b40d-bd74bdf69396"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5c67406-572a-41fe-83d8-a5f8e1191573"], "isController": false}, {"data": [0.525, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e204393d-e930-4e66-8bab-0675d83c7203"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecd85332-7f92-4b9f-8078-07ae1e3769b0"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4bb120a4-a031-403c-ab29-15fbefd44709"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab723e9e-d402-4b84-808a-fc9135329933"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af9f44a8-7e48-4ec5-8e3b-2a9d5dd6d927"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ca75239-423e-416a-97b6-cea357ee8ff1"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b1dd05e-816a-49ce-9bba-7d7e08ac1fb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa90c71d-05b4-4572-a1e0-8e5e4559982b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a3645dc-6875-4ee0-837a-ec028f2cd521"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39655172413793105, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/599d38fd-ce19-4451-a593-66d1c31af088"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.175, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98da3e53-2f85-4a94-ad21-de449d72eae6"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2711864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5086206896551724, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4827586206896552, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecd85332-7f92-4b9f-8078-07ae1e3769b0"], "isController": false}, {"data": [0.9232954545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab723e9e-d402-4b84-808a-fc9135329933"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e204393d-e930-4e66-8bab-0675d83c7203"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af9f44a8-7e48-4ec5-8e3b-2a9d5dd6d927"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7cc5206-0f09-427a-b40d-bd74bdf69396"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2eeb2702-58d1-4bd7-b91f-bc3994ad0b3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa90c71d-05b4-4572-a1e0-8e5e4559982b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b1dd05e-816a-49ce-9bba-7d7e08ac1fb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 26, 1.9622641509433962, 390.88905660377355, 97, 3716, 125.0, 1105.400000000001, 1348.0, 1919.18, 5.194163720040456, 734.9770146005002, 3.8015436527809356], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1820.1551724137926, 1239, 2715, 1802.0, 2206.7, 2528.8999999999996, 2715.0, 0.24927688214790716, 299.96281496725015, 1.2256924820456176], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 613.8571428571428, 105, 1375, 501.5, 1207.5, 1375.0, 1375.0, 0.07607951396059082, 0.014986645328174418, 0.05119021984262409], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 613.8571428571428, 105, 1375, 501.5, 1207.5, 1375.0, 1375.0, 0.07479111908883049, 0.014732848793726095, 0.05032332134004317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 144.58823529411765, 98, 336, 109.0, 318.4, 336.0, 336.0, 0.1212942813313831, 0.053888440476615174, 0.06797719489137027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 125.0, 99, 388, 109.0, 169.5999999999998, 388.0, 388.0, 0.12145546513870928, 0.09026133688531032, 0.06096495027470369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 253.88235294117646, 97, 836, 112.0, 800.8, 836.0, 836.0, 0.12145806838803709, 4.230380056585171, 0.07029469433648171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 257.8235294117647, 98, 1232, 108.0, 983.9999999999998, 1232.0, 1232.0, 0.12146501093185098, 12.88705529069435, 0.07018009420683348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=599d38fd-ce19-4451-a593-66d1c31af088", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f8418f1-06df-41c0-b82d-2351a48168e3", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.8337752937336814, 1.557910411227154], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 269.07142857142856, 104, 705, 245.0, 560.5, 705.0, 705.0, 0.07623445361678029, 0.13771762554180914, 0.04927374771296639], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/98da3e53-2f85-4a94-ad21-de449d72eae6", 3, 0, 0.0, 627.3333333333333, 195, 1468, 219.0, 1468.0, 1468.0, 1468.0, 0.02197560707614548, 0.022039988737501376, 0.014092430319012564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 121.99999999999999, 99, 333, 109.0, 158.59999999999985, 333.0, 333.0, 0.11329858843288058, 0.08419943925529505, 0.05687058052197327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 771.6, 584, 886, 777.0, 886.0, 886.0, 886.0, 0.026693858810841978, 7.84888080991837, 0.015223841353058315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 121.82352941176471, 97, 337, 108.0, 177.79999999999984, 337.0, 337.0, 0.11330160888284614, 0.0403272500366564, 0.06405758470961465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1184.4, 911, 1612, 1183.0, 1612.0, 1612.0, 1612.0, 0.026647480480720548, 23.97744977782663, 0.015171368281503984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 157.0, 100, 347, 107.0, 347.0, 347.0, 347.0, 0.02675871665194937, 0.04735038532551979, 0.014816594083647749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 110.72727272727273, 102, 117, 110.0, 116.8, 117.0, 117.0, 0.060216890290300154, 0.044751028819256265, 0.03022605625899832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 127.36363636363637, 100, 312, 111.0, 272.60000000000014, 312.0, 312.0, 0.06021590137730189, 0.02433440900829885, 0.03388213626858482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 236.8181818181818, 101, 1335, 110.0, 1128.6000000000008, 1335.0, 1335.0, 0.06015333632277186, 4.935291800074918, 0.0348936345466079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 212.54545454545453, 101, 824, 110.0, 725.8000000000004, 824.0, 824.0, 0.060143469512728545, 1.6223893120953985, 0.034946644882884265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 111.8, 100, 145, 105.0, 145.0, 145.0, 145.0, 0.02676229727559814, 0.01988877756516619, 0.01502765716159075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 571.047619047619, 100, 1283, 117.0, 1223.8, 1277.3999999999999, 1283.0, 0.09680318989559085, 37.345058175547976, 0.05334439175329016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 181.8823529411765, 97, 1168, 107.0, 491.19999999999936, 1168.0, 1168.0, 0.11330009863773292, 6.025660858231585, 0.0660353171403055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 441.1904761904762, 97, 994, 115.0, 973.8000000000001, 992.4, 994.0, 0.09680274366633478, 12.213432547502489, 0.053438679783438435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 188.23529411764704, 100, 844, 109.0, 420.7999999999996, 844.0, 844.0, 0.1133031191682218, 1.9884411032058118, 0.06614772518994935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5c67406-572a-41fe-83d8-a5f8e1191573", 3, 0, 0.0, 585.6666666666666, 252, 975, 530.0, 975.0, 975.0, 975.0, 0.04285224545766198, 0.027549864836875788, 0.027480118343617875], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 468.46153846153845, 113, 765, 533.0, 738.1999999999999, 765.0, 765.0, 0.07470491558344539, 0.014809665882265052, 0.05068620774862371], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 373.3636363636364, 211, 1445, 226.0, 1245.4000000000005, 1445.0, 1445.0, 0.06010699044298852, 6.621854372373734, 0.13378394508133568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2eeb2702-58d1-4bd7-b91f-bc3994ad0b3e", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7cc5206-0f09-427a-b40d-bd74bdf69396", 3, 0, 0.0, 348.0, 249, 510, 285.0, 510.0, 510.0, 510.0, 0.01862937479818177, 0.025682097093196552, 0.011946571729302765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5c67406-572a-41fe-83d8-a5f8e1191573", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 923.3500000000001, 148, 1813, 834.0, 1770.5000000000002, 1811.25, 1813.0, 0.08979965696531039, 0.05516014085076195, 0.04060277458490109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 110.04761904761904, 98, 131, 110.0, 116.0, 129.49999999999997, 131.0, 0.09678891259961192, 0.07193004149248503, 0.048583497144727074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 167.80952380952382, 101, 347, 110.0, 333.40000000000003, 346.09999999999997, 347.0, 0.09680051258176187, 0.08821162781585777, 0.05172237209656082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e204393d-e930-4e66-8bab-0675d83c7203", 3, 0, 0.0, 416.3333333333333, 241, 565, 443.0, 565.0, 565.0, 565.0, 0.052505381801634665, 0.03375590138614208, 0.033670443407949315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecd85332-7f92-4b9f-8078-07ae1e3769b0", 1, 0, 0.0, 765.0, 765, 765, 765.0, 765.0, 765.0, 765.0, 1.3071895424836601, 0.23616217320261437, 0.9012459150326797], "isController": false}, {"data": ["login", 20, 0, 0.0, 3306.9000000000005, 1992, 6004, 3224.0, 4706.500000000002, 5942.949999999999, 6004.0, 0.09119136964877643, 27.39919951788263, 0.1753919946516262], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4bb120a4-a031-403c-ab29-15fbefd44709", 2, 0, 0.0, 290.5, 249, 332, 290.5, 332.0, 332.0, 332.0, 0.024806509228021432, 0.028222249268207978, 0.015419280394175432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 129.00000000000003, 105, 344, 113.0, 177.59999999999985, 344.0, 344.0, 0.11092406269167025, 0.08980082809706508, 0.03943003790992966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab723e9e-d402-4b84-808a-fc9135329933", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af9f44a8-7e48-4ec5-8e3b-2a9d5dd6d927", 3, 0, 0.0, 300.3333333333333, 197, 469, 235.0, 469.0, 469.0, 469.0, 0.07278903311901007, 0.032935141938614576, 0.04667786303530268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 683.809523809524, 214, 1392, 233.0, 1340.6, 1387.1999999999998, 1392.0, 0.09674164912264538, 49.68709403057957, 0.20696612573880677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 769.4444444444445, 104, 1718, 1016.0, 1718.0, 1718.0, 1718.0, 0.044427989633469084, 29.533795353572753, 0.0687390087004813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 424.4117647058824, 210, 1339, 232.0, 1090.1999999999998, 1339.0, 1339.0, 0.12119397452074912, 17.223391740363297, 0.26892001687804323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ca75239-423e-416a-97b6-cea357ee8ff1", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1230.6521739130433, 254, 3716, 1214.0, 1884.4000000000005, 3375.9999999999955, 3716.0, 0.08969624172747162, 0.028121477960073474, 0.04046842156063661], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b1dd05e-816a-49ce-9bba-7d7e08ac1fb7", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 133.76923076923077, 105, 319, 115.0, 254.19999999999993, 319.0, 319.0, 0.061691192870396296, 0.04789501790230962, 0.021929291215648683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 355.9411764705882, 209, 1502, 227.0, 657.1999999999992, 1502.0, 1502.0, 0.11321935917842704, 8.132776546609746, 0.2529289785782312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 383.2857142857143, 217, 1265, 236.0, 1022.8000000000003, 1249.6999999999998, 1265.0, 0.11056472248254658, 12.75254352334232, 0.24596845976760348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa90c71d-05b4-4572-a1e0-8e5e4559982b", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 143.23076923076923, 101, 346, 109.0, 334.4, 346.0, 346.0, 0.06629034149724386, 0.049264599491604076, 0.03327464407185873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 175.15384615384616, 102, 336, 110.0, 335.2, 336.0, 336.0, 0.06622111740494722, 0.017719322430620642, 0.037766731020008965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 136.76923076923077, 102, 319, 106.0, 308.2, 319.0, 319.0, 0.06629473619794587, 0.017868503115852603, 0.03897405389762053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 165.76923076923077, 103, 425, 111.0, 384.59999999999997, 425.0, 425.0, 0.0662194308185231, 0.017848205962805053, 0.03899444998395452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a3645dc-6875-4ee0-837a-ec028f2cd521", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.7657936151079137, 1.430886540767386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 114.0, 113, 115, 114.0, 115.0, 115.0, 115.0, 0.05212677231025855, 0.015373325427439532, 0.032222897336321936], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1255.7758620689656, 810, 2240, 1192.0, 1669.5, 2069.35, 2240.0, 0.2582679128835612, 308.97821226282764, 0.5099782420415633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1230.6521739130433, 254, 3716, 1214.0, 1884.4000000000005, 3375.9999999999955, 3716.0, 0.09016284193277772, 0.02826776599998432, 0.04067893845013995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 217.75, 107, 337, 213.5, 337.0, 337.0, 337.0, 0.028211928003159734, 0.007603996219601648, 0.016613078697173166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 161.75, 106, 323, 109.0, 323.0, 323.0, 323.0, 0.028257567729857654, 0.007616297552188195, 0.016612359153685845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/599d38fd-ce19-4451-a593-66d1c31af088", 3, 0, 0.0, 664.6666666666666, 570, 719, 705.0, 719.0, 719.0, 719.0, 0.030895347160717596, 0.02575617971308521, 0.019812445933142468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 155.38461538461542, 101, 334, 108.0, 328.8, 334.0, 334.0, 0.058692864753580265, 0.01581956120311343, 0.03450498494302277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 131.53846153846152, 98, 413, 108.0, 293.7999999999999, 413.0, 413.0, 0.058693129743420724, 0.015819632626156366, 0.03456245823758076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 129.99999999999997, 107, 322, 112.0, 242.39999999999992, 322.0, 322.0, 0.058692864753580265, 0.04361842781003377, 0.02946106687826197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 157.25, 102, 308, 109.5, 308.0, 308.0, 308.0, 0.02821769955204402, 0.007550439137949279, 0.016092906775775104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 186.6923076923077, 102, 336, 109.0, 336.0, 336.0, 336.0, 0.05869392472729899, 0.015705210327421802, 0.03347387894603771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 217.0, 110, 326, 216.0, 326.0, 326.0, 326.0, 0.028256968874948784, 0.020999563783042994, 0.014183673829808277], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 559.3846153846155, 105, 1468, 505.0, 1270.7999999999997, 1468.0, 1468.0, 0.0768071844258663, 0.014903317110277392, 0.052268350639567515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 118.75, 111, 126, 119.0, 126.0, 126.0, 126.0, 0.028007281893292255, 0.022044794146478086, 0.009955713485506232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1789.25, 1279, 2919, 1696.0, 2464.2000000000007, 2897.4999999999995, 2919.0, 0.09053829543551184, 0.04686064119220827, 0.04164407924816999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98da3e53-2f85-4a94-ad21-de449d72eae6", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 438.0, 222, 659, 435.5, 659.0, 659.0, 659.0, 0.028189660032700004, 0.043688467257709876, 0.06339920610869934], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1141.1186440677966, 552, 4344, 968.0, 1926.0, 1971.0, 4344.0, 0.26934366882598115, 82.9590224921936, 0.979161602206792], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 202.62068965517247, 102, 641, 115.0, 447.3, 478.9499999999999, 641.0, 0.25948577078458657, 0.19284049957721713, 0.12543501615075228], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 676.9310344827585, 488, 1013, 624.5, 929.1, 984.2, 1013.0, 0.2592989985693848, 76.242515116461, 0.13040916431956365], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 167.62068965517238, 98, 437, 113.5, 336.0, 338.0, 437.0, 0.25991951457789964, 0.45993570353042407, 0.12640617017558012], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1051.6896551724137, 702, 1788, 1031.5, 1361.2, 1476.3999999999994, 1788.0, 0.2588268894362929, 232.89289008391793, 0.1299189659865767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 137.38095238095238, 109, 327, 118.0, 286.0000000000001, 326.8, 327.0, 0.11000350963578362, 0.08218035631970164, 0.039102810065844956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecd85332-7f92-4b9f-8078-07ae1e3769b0", 3, 0, 0.0, 430.3333333333333, 264, 675, 352.0, 675.0, 675.0, 675.0, 0.05084831946304175, 0.03269056996728758, 0.03260780903066154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 11, 6.25, 194.59090909090924, 98, 2810, 118.0, 339.80000000000007, 410.75, 1665.7799999999847, 0.7508019930380179, 1.6298648823032558, 0.359432956528138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 148.7692307692308, 108, 331, 115.0, 319.8, 331.0, 331.0, 0.06884863891536915, 0.053317354160046605, 0.024473539614447624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 115.6470588235294, 106, 127, 115.0, 125.4, 127.0, 127.0, 0.12101280600223518, 0.09820472830845453, 0.04301627088360704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab723e9e-d402-4b84-808a-fc9135329933", 3, 0, 0.0, 385.6666666666667, 321, 420, 416.0, 420.0, 420.0, 420.0, 0.023359028264424198, 0.027609580608113367, 0.014979585182589737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e204393d-e930-4e66-8bab-0675d83c7203", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.30517578125, 1.1646167652027029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 345.38461538461536, 216, 681, 227.0, 660.6, 681.0, 681.0, 0.0661809999440007, 0.1025676239366495, 0.14884261999124374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af9f44a8-7e48-4ec5-8e3b-2a9d5dd6d927", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 0.8065359933035714, 3.077915736607143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 344.7692307692308, 214, 735, 238.0, 620.1999999999999, 735.0, 735.0, 0.05866399519857762, 0.09091773474623309, 0.13193670013898853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 133.81818181818184, 104, 308, 119.0, 271.60000000000014, 308.0, 308.0, 0.06287402902493813, 0.05212895570524655, 0.022349752504958475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 125.80952380952381, 101, 297, 116.0, 143.20000000000002, 281.9999999999998, 297.0, 0.09376339477068152, 0.07279482308856623, 0.0333299567348907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7cc5206-0f09-427a-b40d-bd74bdf69396", 1, 0, 0.0, 584.0, 584, 584, 584.0, 584.0, 584.0, 584.0, 1.7123287671232876, 0.3093562714041096, 1.180570419520548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2eeb2702-58d1-4bd7-b91f-bc3994ad0b3e", 3, 0, 0.0, 330.0, 218, 505, 267.0, 505.0, 505.0, 505.0, 0.02282462320351195, 0.027111669944536163, 0.014636884020481293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa90c71d-05b4-4572-a1e0-8e5e4559982b", 3, 0, 0.0, 317.0, 224, 489, 238.0, 489.0, 489.0, 489.0, 0.08609309533375423, 0.03996378709177524, 0.05520943939046089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b1dd05e-816a-49ce-9bba-7d7e08ac1fb7", 3, 0, 0.0, 379.0, 212, 528, 397.0, 528.0, 528.0, 528.0, 0.02479789713832267, 0.024870547227595102, 0.015902297318520723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 124.38095238095235, 102, 337, 111.0, 132.20000000000002, 316.6999999999997, 337.0, 0.1106322898776723, 0.08221794198916857, 0.05553222363000347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 162.9047619047619, 100, 349, 115.0, 333.6, 347.59999999999997, 349.0, 0.1106375356279207, 0.045430126469240134, 0.06221303389196508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 221.1904761904762, 99, 1163, 108.0, 870.4000000000004, 1147.0999999999997, 1163.0, 0.11064686263455448, 9.508910283176935, 0.06414266134683576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 191.61904761904762, 99, 815, 110.0, 484.8000000000001, 785.8999999999996, 815.0, 0.11064744562468387, 3.1254610310234363, 0.06425105345588855], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 26.923076923076923, 0.5283018867924528], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.6923076923076925, 0.1509433962264151], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.1509433962264151], "isController": false}, {"data": ["401/Unauthorized", 15, 57.69230769230769, 1.1320754716981132], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 26, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
