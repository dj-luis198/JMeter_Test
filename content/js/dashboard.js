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

    var data = {"OkPercent": 97.49447310243184, "KoPercent": 2.5055268975681653};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7873817034700316, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36065573770491804, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=702395a2-2c3a-403e-af69-9b28fe3dcda1"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/39bbf0ea-73ab-4fc5-99e4-ecb148c4246e"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f06ddb34-abee-433d-9f2b-250f613f04cb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=679b913f-722e-4e47-a95e-c490178a79b4"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1f653323-09d4-4177-aaf1-fd0b19511491"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/42397bf1-0635-4889-aef4-81c068d4ff86"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c69feb91-f636-4851-acbe-135be7a8f9f1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a66cabe5-675b-46bb-9d0f-1e5b8919e7e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f653323-09d4-4177-aaf1-fd0b19511491"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cb714e8f-0aae-48c4-940c-bb6607c8b82d"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=143633d7-cf37-40fe-af7b-6aea6a757220"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d0c2c33-e74c-40c3-a22e-e3f356a123dd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/62bcba12-5f39-479a-a6b6-5fbd5c802e7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db42f8e4-6e19-4b4f-bce4-390f34a38c43"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39bbf0ea-73ab-4fc5-99e4-ecb148c4246e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/205119f1-367b-4d79-8a82-e7d7f37b46d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42397bf1-0635-4889-aef4-81c068d4ff86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/679b913f-722e-4e47-a95e-c490178a79b4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.48360655737704916, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a66cabe5-675b-46bb-9d0f-1e5b8919e7e0"], "isController": false}, {"data": [0.9918032786885246, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c69feb91-f636-4851-acbe-135be7a8f9f1"], "isController": false}, {"data": [0.819672131147541, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9277456647398844, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/702395a2-2c3a-403e-af69-9b28fe3dcda1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db42f8e4-6e19-4b4f-bce4-390f34a38c43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb714e8f-0aae-48c4-940c-bb6607c8b82d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62bcba12-5f39-479a-a6b6-5fbd5c802e7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d8cfba0-1727-4448-8e0f-a62773d22247"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/143633d7-cf37-40fe-af7b-6aea6a757220"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d0c2c33-e74c-40c3-a22e-e3f356a123dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 34, 2.5055268975681653, 337.0383198231401, 79, 5424, 94.0, 886.2, 1129.0, 2319.0600000000104, 5.332233093638258, 774.4284371438956, 3.9000258482651575], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 61, 0, 0.0, 1367.1147540983604, 979, 2057, 1335.0, 1718.2000000000003, 1793.1, 2057.0, 0.27670799141751606, 332.97296263818384, 1.3605710320187434], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=702395a2-2c3a-403e-af69-9b28fe3dcda1", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 625.0625, 83, 1335, 597.0, 1310.5, 1335.0, 1335.0, 0.09300811495803009, 0.019459949833747995, 0.06210380722905574], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 625.0625, 83, 1335, 597.0, 1310.5, 1335.0, 1335.0, 0.09365323718267649, 0.019594927799207462, 0.0625345712145069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 105.42857142857143, 80, 246, 82.0, 243.0, 245.7, 246.0, 0.1000843568150298, 0.026780384538396648, 0.05707935974607169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 83.61904761904762, 81, 92, 83.0, 90.0, 91.9, 92.0, 0.10007958710021779, 0.07437555252272045, 0.05023526149366401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 105.61904761904762, 80, 246, 83.0, 243.8, 245.8, 246.0, 0.1000843568150298, 0.026975861797801003, 0.05893639371041306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 124.6190476190476, 80, 324, 83.0, 244.6, 316.0999999999999, 324.0, 0.09996858130301906, 0.026944656679329354, 0.058770591742595184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39bbf0ea-73ab-4fc5-99e4-ecb148c4246e", 3, 0, 0.0, 642.6666666666666, 576, 768, 584.0, 768.0, 768.0, 768.0, 0.024826011039299576, 0.024898743493516274, 0.015920326089655], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 238.4375, 83, 576, 202.0, 510.9000000000001, 576.0, 576.0, 0.09286667827500145, 0.1431600154535957, 0.060014183934064665], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 92.88235294117646, 80, 247, 84.0, 118.99999999999989, 247.0, 247.0, 0.08643657589131364, 0.0642365568879782, 0.043387109382944544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 110.94117647058823, 80, 247, 82.0, 243.8, 247.0, 247.0, 0.08643789437289308, 0.06131290899106639, 0.04716148441829839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 590.8333333333334, 474, 661, 641.0, 661.0, 661.0, 661.0, 0.04203888596952181, 12.360828297425119, 0.02397530215449291], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f06ddb34-abee-433d-9f2b-250f613f04cb", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 875.1666666666667, 650, 974, 928.0, 974.0, 974.0, 974.0, 0.041993574983027596, 37.78589258655926, 0.023908451381938565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 139.5, 79, 256, 89.0, 256.0, 256.0, 256.0, 0.04215436930037798, 0.07459347380105948, 0.023341335345033513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 100.38461538461539, 82, 241, 84.0, 192.19999999999996, 241.0, 241.0, 0.08305276405987466, 0.061721829540590446, 0.041688594459741775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 120.07692307692307, 80, 251, 83.0, 248.2, 251.0, 251.0, 0.08296424879063653, 0.03178468065146081, 0.04677957117056174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 181.53846153846152, 80, 878, 84.0, 624.7999999999997, 878.0, 878.0, 0.0826335962776743, 5.740086401767724, 0.04803326081705558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=679b913f-722e-4e47-a95e-c490178a79b4", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 150.92307692307693, 80, 645, 83.0, 484.59999999999985, 645.0, 645.0, 0.08275616215115095, 1.8923633767378796, 0.0481853224784834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 110.16666666666666, 82, 243, 83.0, 243.0, 243.0, 243.0, 0.04220566822124211, 0.03136573585582544, 0.023699471901576383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 508.26315789473693, 81, 1127, 247.0, 1052.0, 1127.0, 1127.0, 0.08439305844885558, 35.98214035370685, 0.046178479659052044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 325.2352941176471, 81, 956, 242.0, 948.0, 956.0, 956.0, 0.086437454874564, 22.89190825458627, 0.04863099914071001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 356.7368421052632, 81, 655, 246.0, 653.0, 655.0, 655.0, 0.08433125316242199, 11.75752607888523, 0.04622701557243167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 269.94117647058823, 81, 723, 86.0, 660.5999999999999, 723.0, 723.0, 0.086437454874564, 7.491587045694906, 0.04871541071773595], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 487.68749999999994, 88, 1991, 379.5, 1386.2000000000007, 1991.0, 1991.0, 0.09406010440671589, 0.019680056024549687, 0.06317366875558482], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1f653323-09d4-4177-aaf1-fd0b19511491", 3, 0, 0.0, 858.6666666666667, 349, 1744, 483.0, 1744.0, 1744.0, 1744.0, 0.057902761961745576, 0.026199491903263785, 0.03713165399239544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 295.4615384615385, 166, 960, 181.0, 769.9999999999998, 960.0, 960.0, 0.082589498427623, 7.718594152028207, 0.18412023323592008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42397bf1-0635-4889-aef4-81c068d4ff86", 3, 0, 0.0, 1267.3333333333333, 262, 2852, 688.0, 2852.0, 2852.0, 2852.0, 0.06547502127938193, 0.029625742050241165, 0.0419875624740828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c69feb91-f636-4851-acbe-135be7a8f9f1", 3, 0, 0.0, 423.6666666666667, 261, 616, 394.0, 616.0, 616.0, 616.0, 0.019205408242961217, 0.0227001423600886, 0.012315968176638542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a66cabe5-675b-46bb-9d0f-1e5b8919e7e0", 3, 0, 0.0, 419.0, 209, 534, 514.0, 534.0, 534.0, 534.0, 0.04896600127311603, 0.03205424106778527, 0.031400723472668805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f653323-09d4-4177-aaf1-fd0b19511491", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 745.2380952380953, 142, 2402, 641.0, 1784.0000000000005, 2349.999999999999, 2402.0, 0.09820426487093153, 0.060322736917789, 0.044402904917227835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 83.94736842105263, 82, 92, 83.0, 89.0, 92.0, 92.0, 0.08439193390779072, 0.06271705244514525, 0.04236079494980901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 125.21052631578947, 81, 247, 83.0, 245.0, 247.0, 247.0, 0.08433050456272413, 0.08256206059368675, 0.04473989864804886], "isController": false}, {"data": ["login", 21, 0, 0.0, 3909.571428571429, 1318, 7861, 3499.0, 6017.2, 7676.999999999997, 7861.0, 0.09614812305128358, 32.995492627499274, 0.19061955589868734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 98.00000000000001, 83, 243, 87.0, 139.7999999999999, 243.0, 243.0, 0.0882543802725503, 0.07144812621674237, 0.03137167423750811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb714e8f-0aae-48c4-940c-bb6607c8b82d", 3, 0, 0.0, 1108.3333333333333, 195, 2635, 495.0, 2635.0, 2635.0, 2635.0, 0.020320522372895132, 0.024018169510410883, 0.013031064151889132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 611.1052631578947, 167, 1211, 332.0, 1136.0, 1211.0, 1211.0, 0.08429907537224697, 47.840288538542424, 0.1793738395012157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=143633d7-cf37-40fe-af7b-6aea6a757220", 1, 0, 0.0, 1127.0, 1127, 1127, 1127.0, 1127.0, 1127.0, 1127.0, 0.8873114463176576, 0.16030529059449866, 0.6117596495119787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d0c2c33-e74c-40c3-a22e-e3f356a123dd", 3, 0, 0.0, 398.66666666666663, 186, 817, 193.0, 817.0, 817.0, 817.0, 0.018220246337730485, 0.025118080481864785, 0.011684207449651388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62bcba12-5f39-479a-a6b6-5fbd5c802e7e", 3, 0, 0.0, 1183.3333333333333, 213, 2769, 568.0, 2769.0, 2769.0, 2769.0, 0.08196273427681547, 0.03708600281405388, 0.05256073780121305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db42f8e4-6e19-4b4f-bce4-390f34a38c43", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39bbf0ea-73ab-4fc5-99e4-ecb148c4246e", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/205119f1-367b-4d79-8a82-e7d7f37b46d7", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 225.57142857142858, 163, 409, 169.0, 335.4, 401.69999999999993, 409.0, 0.09992434299744479, 0.15486321517279775, 0.22473218937804235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, 57.142857142857146, 473.2857142857142, 81, 1063, 99.5, 1058.5, 1063.0, 1063.0, 0.08355714712026262, 42.85423194568785, 0.11238482915547597], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 1055.9615384615383, 229, 2259, 1104.5, 1730.7, 2120.3999999999996, 2259.0, 0.10636339462864858, 0.03319062058949866, 0.0479881721859723], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 99.3125, 83, 253, 88.0, 146.6000000000001, 253.0, 253.0, 0.08543220687408895, 0.0663267621727546, 0.030368479787273805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 433.52941176470586, 165, 1039, 326.0, 1029.4, 1039.0, 1039.0, 0.0864001138448559, 30.495865182787067, 0.1878140342373157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42397bf1-0635-4889-aef4-81c068d4ff86", 1, 0, 0.0, 785.0, 785, 785, 785.0, 785.0, 785.0, 785.0, 1.2738853503184713, 0.23014530254777069, 0.8782842356687898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 231.78947368421052, 163, 500, 170.0, 487.0, 500.0, 500.0, 0.11796333202952808, 0.1828201249324815, 0.2653022985000031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 84.66666666666667, 82, 91, 83.5, 91.0, 91.0, 91.0, 0.10355540214014497, 0.07695865334829134, 0.05197995771487746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 163.0, 82, 245, 163.0, 245.0, 245.0, 245.0, 0.10354825348612454, 0.027707247514841916, 0.0590548633163054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 82.16666666666666, 80, 85, 82.5, 85.0, 85.0, 85.0, 0.10355182768975874, 0.02791045355700528, 0.060877148700424565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/679b913f-722e-4e47-a95e-c490178a79b4", 3, 0, 0.0, 1094.0, 189, 2564, 529.0, 2564.0, 2564.0, 2564.0, 0.07469561536737793, 0.03379782075542166, 0.047900508552647963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 91.25, 88, 96, 90.5, 96.0, 96.0, 96.0, 0.029396202010700218, 0.008669583014874478, 0.018171675657005115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 136.83333333333334, 81, 247, 84.5, 247.0, 247.0, 247.0, 0.10355004055709922, 0.02790997186890565, 0.06097722114836995], "isController": false}, {"data": ["https://demoqa.com/books", 61, 0, 0.0, 945.9344262295081, 637, 1675, 876.0, 1337.6000000000001, 1456.1999999999998, 1675.0, 0.25853373229467763, 309.2962246923025, 0.5105031315428107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 1055.9615384615383, 229, 2259, 1104.5, 1730.7, 2120.3999999999996, 2259.0, 0.10557861139761716, 0.03294572954820476, 0.04763410006415931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 108.33333333333334, 81, 240, 82.0, 240.0, 240.0, 240.0, 0.07265593780651723, 0.019583045736912847, 0.04278469775129872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 82.16666666666667, 79, 83, 83.0, 83.0, 83.0, 83.0, 0.07265593780651723, 0.019583045736912847, 0.042713744687034545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 112.9375, 80, 244, 82.5, 244.0, 244.0, 244.0, 0.0863996198416727, 0.023287397535450845, 0.05079352650848336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 143.0, 80, 246, 86.5, 245.3, 246.0, 246.0, 0.08639915328829777, 0.023287271784736507, 0.050877626399261286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 107.00000000000001, 81, 282, 83.0, 258.20000000000005, 282.0, 282.0, 0.08639868673996155, 0.06420839903233472, 0.043368090805019764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 82.16666666666667, 80, 83, 82.5, 83.0, 83.0, 83.0, 0.07265593780651723, 0.019441139608384495, 0.04143658953027936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 103.25000000000001, 80, 244, 82.5, 241.2, 244.0, 244.0, 0.08639915328829777, 0.0231185234384703, 0.049274517109732324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 83.33333333333333, 81, 90, 82.5, 90.0, 90.0, 90.0, 0.07265681763138775, 0.053995935759263744, 0.036470316662630176], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 591.5625, 81, 1744, 521.5, 1556.4, 1744.0, 1744.0, 0.09340556697179152, 0.018904593510648236, 0.06355500858163647], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 112.83333333333333, 82, 249, 86.0, 249.0, 249.0, 249.0, 0.08062457168196294, 0.06346035622623256, 0.028659515715072765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2096.666666666667, 941, 5424, 1624.0, 4019.2000000000007, 5297.499999999998, 5424.0, 0.09713498061925863, 0.05027494114082722, 0.044678296749678534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 192.66666666666666, 164, 321, 166.5, 321.0, 321.0, 321.0, 0.07258386460689788, 0.1124908136046357, 0.16324281268524007], "isController": false}, {"data": ["addBook", 56, 9, 16.071428571428573, 1001.6607142857141, 429, 4720, 788.5, 1530.5000000000002, 1912.2999999999986, 4720.0, 0.2618327356377731, 84.96842574090482, 0.9504632408463742], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a66cabe5-675b-46bb-9d0f-1e5b8919e7e0", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/books-0", 61, 0, 0.0, 146.59016393442627, 81, 580, 84.0, 329.0, 334.8, 580.0, 0.25950821066961627, 0.19285717609333786, 0.12544586355611334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c69feb91-f636-4851-acbe-135be7a8f9f1", 1, 0, 0.0, 1991.0, 1991, 1991, 1991.0, 1991.0, 1991.0, 1991.0, 0.5022601707684581, 0.09074036288297338, 0.346284844299347], "isController": false}, {"data": ["https://demoqa.com/books-3", 61, 0, 0.0, 526.2622950819673, 397, 735, 483.0, 658.8, 727.5, 735.0, 0.2596595480221179, 76.34852862693307, 0.13059049534315498], "isController": false}, {"data": ["https://demoqa.com/books-1", 61, 0, 0.0, 108.13114754098359, 80, 256, 84.0, 242.0, 246.7, 256.0, 0.25990515592178987, 0.4599102954397297, 0.12639918715727672], "isController": false}, {"data": ["https://demoqa.com/books-2", 61, 0, 0.0, 795.4262295081967, 555, 1202, 794.0, 1037.0000000000002, 1060.9, 1202.0, 0.25920936893142, 233.23704580596055, 0.13011095276440418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 86.21052631578947, 82, 91, 86.0, 90.0, 91.0, 91.0, 0.116911565630461, 0.08734115987041276, 0.041558408095202934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, 5.202312138728324, 185.63583815028903, 82, 3403, 93.0, 311.0, 410.29999999999825, 2527.579999999989, 0.698902359704441, 1.630209322266706, 0.33078637751433154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 97.0, 83, 143, 89.0, 143.0, 143.0, 143.0, 0.08748778816290226, 0.06775177345037255, 0.031099174698531663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/702395a2-2c3a-403e-af69-9b28fe3dcda1", 3, 0, 0.0, 1111.3333333333333, 338, 2565, 431.0, 2565.0, 2565.0, 2565.0, 0.018331693665177725, 0.02527171961980067, 0.01175567595065108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 87.14285714285714, 82, 99, 86.0, 93.6, 98.5, 99.0, 0.09855222094469343, 0.07997743711429711, 0.03503223478893399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db42f8e4-6e19-4b4f-bce4-390f34a38c43", 3, 0, 0.0, 290.0, 192, 456, 222.0, 456.0, 456.0, 456.0, 0.06990562740300595, 0.03163047594081324, 0.044828804031224516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb714e8f-0aae-48c4-940c-bb6607c8b82d", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 248.83333333333334, 165, 332, 248.5, 332.0, 332.0, 332.0, 0.10339835941269732, 0.16024726209760806, 0.23254533371820502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 252.06249999999997, 165, 528, 174.5, 501.40000000000003, 528.0, 528.0, 0.08635998078490428, 0.1338411030328546, 0.19422562084729939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 103.53846153846153, 83, 256, 89.0, 196.79999999999995, 256.0, 256.0, 0.08528672741705866, 0.07071135896199493, 0.030316766386532572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62bcba12-5f39-479a-a6b6-5fbd5c802e7e", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.5376906622023809, 2.051943824404762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 89.3157894736842, 83, 106, 86.0, 103.0, 106.0, 106.0, 0.08741298957025014, 0.06786457686362193, 0.031072586136299853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d8cfba0-1727-4448-8e0f-a62773d22247", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/143633d7-cf37-40fe-af7b-6aea6a757220", 3, 0, 0.0, 663.6666666666667, 225, 1476, 290.0, 1476.0, 1476.0, 1476.0, 0.03081949024563134, 0.02539196933974379, 0.01976380071090291], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d0c2c33-e74c-40c3-a22e-e3f356a123dd", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 100.73684210526316, 81, 257, 83.0, 244.0, 257.0, 257.0, 0.11814157090981445, 0.08779856978746953, 0.05930153071059045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 99.5263157894737, 81, 241, 83.0, 239.0, 241.0, 241.0, 0.11802708410982732, 0.031581465865324884, 0.06731232140638589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 112.36842105263159, 79, 329, 83.0, 242.0, 329.0, 329.0, 0.11814524403211063, 0.031843835305529825, 0.06945648135481504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 129.421052631579, 81, 332, 83.0, 242.0, 332.0, 332.0, 0.11802561777093092, 0.03181159228982122, 0.0695014135897181], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 26.470588235294116, 0.6632277081798084], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.2947678703021371], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.764705882352942, 0.2947678703021371], "isController": false}, {"data": ["401/Unauthorized", 17, 50.0, 1.2527634487840826], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 34, "401/Unauthorized", 17, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
