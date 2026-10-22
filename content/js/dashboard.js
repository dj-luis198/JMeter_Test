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

    var data = {"OkPercent": 97.65567765567765, "KoPercent": 2.3443223443223444};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8006883604505632, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e3a2c07-9b01-45e8-b9ea-c58e052a2ff7"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=402d38fd-42f1-4858-93e1-d922987766be"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1e0a03b-ce2a-41db-baae-81ebf92b35f1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b935fa9-eacd-4a10-a36f-e44e29a7d4b7"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2aa69520-a45b-49b6-ae8e-b92ef3f341b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e13be9b-3fe6-4f6b-bd0c-098c0e93601d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a36cec1f-564e-4135-9e7e-682ce0855fa2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d083e3c-9f99-4d0c-9861-c40de6c4f230"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65573306-870b-4423-bc83-c67fa39624b2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b3f970f-0cb8-4a45-8508-d003f81c2e21"], "isController": false}, {"data": [0.82, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3dc24ef7-994a-4397-b1a3-7a441db1612e"], "isController": false}, {"data": [0.08, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d2cf5f6b-97ae-4a34-8b51-51bb96df5492"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8c6dbb6-8075-4a8e-9b09-9c2d8fd7b92e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92db19e0-dc2d-49e8-9e9b-d295a87536f6"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2650df45-6a26-4c7d-bc37-36904821ab26"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46673f59-300f-4bef-8a5d-07677ecd8c9d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a36cec1f-564e-4135-9e7e-682ce0855fa2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b3f970f-0cb8-4a45-8508-d003f81c2e21"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e3a2c07-9b01-45e8-b9ea-c58e052a2ff7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2aa69520-a45b-49b6-ae8e-b92ef3f341b1"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1e0a03b-ce2a-41db-baae-81ebf92b35f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.34, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b935fa9-eacd-4a10-a36f-e44e29a7d4b7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e13be9b-3fe6-4f6b-bd0c-098c0e93601d"], "isController": false}, {"data": [0.36507936507936506, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8363636363636363, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9033149171270718, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1d083e3c-9f99-4d0c-9861-c40de6c4f230"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/402d38fd-42f1-4858-93e1-d922987766be"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2cf5f6b-97ae-4a34-8b51-51bb96df5492"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46673f59-300f-4bef-8a5d-07677ecd8c9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3dc24ef7-994a-4397-b1a3-7a441db1612e"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/2650df45-6a26-4c7d-bc37-36904821ab26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1365, 32, 2.3443223443223444, 305.46446886446915, 82, 5099, 96.0, 691.8000000000006, 847.2000000000003, 1861.899999999993, 5.288873218153428, 735.7888964962184, 3.8639998580915886], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1298.8727272727276, 1006, 2553, 1286.0, 1467.1999999999998, 1718.9999999999995, 2553.0, 0.24357515179160594, 293.10310556934587, 1.1976571184284532], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9e3a2c07-9b01-45e8-b9ea-c58e052a2ff7", 3, 0, 0.0, 367.6666666666667, 200, 543, 360.0, 543.0, 543.0, 543.0, 0.018462674626130837, 0.025452287448458365, 0.011839670902824789], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 695.6250000000001, 86, 4833, 449.0, 2011.300000000003, 4833.0, 4833.0, 0.09576766763830946, 0.01935343918154557, 0.06423284299788713], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 695.6250000000001, 86, 4833, 449.0, 2011.300000000003, 4833.0, 4833.0, 0.09252084610313761, 0.018697297451628944, 0.06205515001387813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 137.21052631578948, 83, 254, 85.0, 252.0, 254.0, 254.0, 0.10223243350856331, 0.043518144239202375, 0.057400652942410854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 113.94736842105264, 83, 271, 86.0, 261.0, 271.0, 271.0, 0.10232272587741738, 0.07604257264913537, 0.051361212012688014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 169.26315789473685, 83, 581, 85.0, 431.0, 581.0, 581.0, 0.10222693303059813, 3.1886648490000593, 0.05927333632391949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 187.3684210526316, 83, 830, 86.0, 606.0, 830.0, 830.0, 0.10232382798825969, 9.716377450386407, 0.05922959245496405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=402d38fd-42f1-4858-93e1-d922987766be", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1e0a03b-ce2a-41db-baae-81ebf92b35f1", 1, 0, 0.0, 1667.0, 1667, 1667, 1667.0, 1667.0, 1667.0, 1667.0, 0.5998800239952009, 0.10837676214757049, 0.41358915716856626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b935fa9-eacd-4a10-a36f-e44e29a7d4b7", 3, 0, 0.0, 461.66666666666663, 200, 902, 283.0, 902.0, 902.0, 902.0, 0.01903058214550783, 0.02249350383149054, 0.012203856388883603], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 231.43750000000003, 85, 512, 205.0, 423.80000000000007, 512.0, 512.0, 0.0963164960058753, 0.17563769233200296, 0.06224947364539878], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2aa69520-a45b-49b6-ae8e-b92ef3f341b1", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.0443009393063585, 3.9852781791907517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 117.125, 84, 256, 85.5, 255.3, 256.0, 256.0, 0.08334288303868151, 0.0619374355394889, 0.04183422058777568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 120.0, 83, 302, 86.0, 274.0, 302.0, 302.0, 0.08334201479320762, 0.03012398752474216, 0.04709352862277321], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 507.1111111111111, 412, 688, 433.0, 688.0, 688.0, 688.0, 0.059530109006244045, 17.503828633486346, 0.03395076529262356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 695.4444444444445, 575, 779, 747.0, 779.0, 779.0, 779.0, 0.05953562214725144, 53.570257460557656, 0.03389576924985117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 140.77777777777777, 84, 251, 89.0, 251.0, 251.0, 251.0, 0.059669431350319234, 0.10558692344411959, 0.03303961677307715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 107.8, 84, 251, 85.0, 250.4, 251.0, 251.0, 0.06886040618458263, 0.05117457920553454, 0.03456469607312057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 107.33333333333333, 83, 252, 85.0, 252.0, 252.0, 252.0, 0.06886167067594616, 0.018425876723837154, 0.039272671557375544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 142.4, 84, 261, 86.0, 260.4, 261.0, 261.0, 0.06880923328164995, 0.018546238657944716, 0.04045230315971999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e13be9b-3fe6-4f6b-bd0c-098c0e93601d", 1, 0, 0.0, 828.0, 828, 828, 828.0, 828.0, 828.0, 828.0, 1.2077294685990339, 0.21819331219806765, 0.8326728562801933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 141.66666666666666, 83, 262, 85.0, 261.4, 262.0, 262.0, 0.06880954893047025, 0.01854632373516581, 0.040519685551829644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a36cec1f-564e-4135-9e7e-682ce0855fa2", 3, 0, 0.0, 837.3333333333334, 185, 1696, 631.0, 1696.0, 1696.0, 1696.0, 0.0191477954504838, 0.02639678181406214, 0.012279022473129262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 86.33333333333333, 84, 93, 85.0, 93.0, 93.0, 93.0, 0.05973438111862584, 0.04439244534304128, 0.033542255022665876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 512.1333333333333, 84, 841, 587.0, 790.6, 841.0, 841.0, 0.07615643547265222, 45.6906385177673, 0.04040852533216899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 151.87499999999997, 84, 582, 85.0, 381.1000000000002, 582.0, 582.0, 0.08334244891368327, 4.708039559339824, 0.048548604274425845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 406.53333333333336, 83, 681, 417.0, 671.4, 681.0, 681.0, 0.0761579821181058, 14.935492602521336, 0.040483719010047776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 127.0, 83, 582, 86.0, 349.60000000000025, 582.0, 582.0, 0.08334288303868151, 1.5526579705747532, 0.04863024669493379], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 624.3125, 86, 3184, 404.0, 2122.1000000000013, 3184.0, 3184.0, 0.09270686668173155, 0.018734889867139472, 0.06267785414023073], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d083e3c-9f99-4d0c-9861-c40de6c4f230", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65573306-870b-4423-bc83-c67fa39624b2", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 274.26666666666665, 170, 508, 175.0, 505.6, 508.0, 508.0, 0.06878115213015229, 0.10659735198296062, 0.15469042319896553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b3f970f-0cb8-4a45-8508-d003f81c2e21", 3, 0, 0.0, 276.3333333333333, 185, 397, 247.0, 397.0, 397.0, 397.0, 0.026050259634254357, 0.030790524977857277, 0.01670540738264358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 438.76, 110, 1663, 327.0, 904.8000000000004, 1467.3999999999996, 1663.0, 0.104579756705654, 0.06423893258579723, 0.0472855735885916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 101.33333333333333, 84, 330, 85.0, 183.60000000000008, 330.0, 330.0, 0.07622028679153244, 0.056644177976910334, 0.03825901114340593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 152.13333333333333, 84, 253, 86.0, 253.0, 253.0, 253.0, 0.0762206740956417, 0.09671490482578494, 0.039202039411169884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3dc24ef7-994a-4397-b1a3-7a441db1612e", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["login", 25, 0, 0.0, 2422.8399999999997, 1190, 4715, 2319.0, 3846.0000000000005, 4498.4, 4715.0, 0.10395615545187661, 44.91128040587602, 0.21890486218532473], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 97.87500000000001, 85, 255, 87.0, 140.2000000000001, 255.0, 255.0, 0.0854230845208032, 0.06915599323022055, 0.03036523707575426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2cf5f6b-97ae-4a34-8b51-51bb96df5492", 3, 0, 0.0, 328.3333333333333, 178, 453, 354.0, 453.0, 453.0, 453.0, 0.023994625203954314, 0.028360834673033238, 0.015387178272067056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 615.4666666666667, 171, 1090, 674.0, 992.8000000000001, 1090.0, 1090.0, 0.07612281146917026, 60.75222322221517, 0.15821749714539457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8c6dbb6-8075-4a8e-9b09-9c2d8fd7b92e", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92db19e0-dc2d-49e8-9e9b-d295a87536f6", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.9229362355491331, 1.7245077673410405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 351.3157894736842, 170, 1091, 337.0, 696.0, 1091.0, 1091.0, 0.10217910383548089, 13.009239100111321, 0.2270512539123841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 504.6, 84, 864, 667.0, 851.4, 864.0, 864.0, 0.09916109711837852, 71.18930101342642, 0.1604395563532515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2650df45-6a26-4c7d-bc37-36904821ab26", 1, 0, 0.0, 3184.0, 3184, 3184, 3184.0, 3184.0, 3184.0, 3184.0, 0.314070351758794, 0.056741225659547735, 0.21653678548994973], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 702.3461538461537, 130, 2203, 680.5, 1382.8000000000002, 1968.849999999999, 2203.0, 0.10483490518489248, 0.03271365656085062, 0.04729856073771516], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/46673f59-300f-4bef-8a5d-07677ecd8c9d", 3, 0, 0.0, 274.3333333333333, 176, 451, 196.0, 451.0, 451.0, 451.0, 0.10968520346605243, 0.0496296981828818, 0.07033849310811305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a36cec1f-564e-4135-9e7e-682ce0855fa2", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.2809705482115085, 1.072244362363919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 281.43749999999994, 170, 668, 173.5, 591.0000000000001, 668.0, 668.0, 0.08330513107541718, 6.3499061596985396, 0.18602304232941974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 98.58823529411765, 85, 252, 89.0, 126.39999999999989, 252.0, 252.0, 0.10297850172337551, 0.07994912975594096, 0.03660563928448114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b3f970f-0cb8-4a45-8508-d003f81c2e21", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 302.66666666666674, 171, 849, 175.5, 831.9, 849.0, 849.0, 0.09529153917011657, 12.798141748811503, 0.21160387902739103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 85.11111111111111, 83, 88, 85.0, 88.0, 88.0, 88.0, 0.05156056647875704, 0.03831796004915441, 0.025880987470782348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 121.77777777777777, 84, 251, 85.0, 251.0, 251.0, 251.0, 0.05156115726152965, 0.013796637782870236, 0.029405972500716124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 141.0, 83, 260, 87.0, 260.0, 260.0, 260.0, 0.051560861868451054, 0.013897263550480949, 0.03031214730938236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 149.44444444444446, 83, 336, 85.0, 336.0, 336.0, 336.0, 0.05156174805784082, 0.01389750240621491, 0.030363021561404312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 86.66666666666667, 86, 87, 87.0, 87.0, 87.0, 87.0, 0.025341262332747666, 0.007473692602040816, 0.015665057672489525], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 803.7272727272729, 658, 1342, 676.0, 1094.0, 1155.8, 1342.0, 0.23811585418650966, 284.8693440719976, 0.47018579801281496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e3a2c07-9b01-45e8-b9ea-c58e052a2ff7", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2aa69520-a45b-49b6-ae8e-b92ef3f341b1", 3, 0, 0.0, 290.0, 191, 387, 292.0, 387.0, 387.0, 387.0, 0.12942749902929376, 0.058562572802968206, 0.08299875426032186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 702.3461538461537, 130, 2203, 680.5, 1382.8000000000002, 1968.849999999999, 2203.0, 0.10170711480386174, 0.03173763182806803, 0.04588738968689856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 85.11111111111111, 83, 87, 85.0, 87.0, 87.0, 87.0, 0.05055214172573778, 0.013625381949515262, 0.029768497520136605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 104.55555555555556, 84, 255, 85.0, 255.0, 255.0, 255.0, 0.05055214172573778, 0.013625381949515262, 0.029719130194232564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1e0a03b-ce2a-41db-baae-81ebf92b35f1", 3, 0, 0.0, 262.0, 192, 386, 208.0, 386.0, 386.0, 386.0, 0.08373339287707937, 0.03886843041755052, 0.05369621873953332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 121.70588235294117, 83, 339, 85.0, 276.59999999999997, 339.0, 339.0, 0.10246457438024001, 0.027617404813424066, 0.060237962672758286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 130.64705882352942, 83, 338, 86.0, 269.99999999999994, 338.0, 338.0, 0.10246580957030661, 0.027617737735746706, 0.06033875309657704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 112.44444444444443, 83, 336, 85.0, 336.0, 336.0, 336.0, 0.05055242567389192, 0.013526723276021863, 0.028830680267141487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 106.6470588235294, 85, 262, 86.0, 254.0, 262.0, 262.0, 0.10236092462021087, 0.07607096058201217, 0.05138038599100428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 105.0, 84, 254, 86.0, 254.0, 254.0, 254.0, 0.050550438103796905, 0.0375672689423725, 0.02537395037631993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 86.17647058823529, 82, 102, 85.0, 91.6, 102.0, 102.0, 0.10246395679637398, 0.027417113439654757, 0.05843647536043203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 90.55555555555556, 86, 108, 87.0, 108.0, 108.0, 108.0, 0.04996363757487606, 0.03932684754428721, 0.017760511794194224], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 675.8749999999998, 84, 3366, 452.0, 2005.9000000000015, 3366.0, 3366.0, 0.09274985942599431, 0.018268053977519752, 0.06311451310671451], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1407.4799999999996, 766, 3321, 1136.0, 2428.6000000000017, 3186.2999999999997, 3321.0, 0.10341047754958532, 0.053523001075468965, 0.04756478020102997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 219.55555555555557, 171, 591, 173.0, 591.0, 591.0, 591.0, 0.05052603213455644, 0.07830548144291119, 0.11363423047449558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b935fa9-eacd-4a10-a36f-e44e29a7d4b7", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e13be9b-3fe6-4f6b-bd0c-098c0e93601d", 3, 0, 0.0, 353.3333333333333, 202, 545, 313.0, 545.0, 545.0, 545.0, 0.03167095984122292, 0.02592853645855327, 0.020309827762763397], "isController": false}, {"data": ["addBook", 63, 11, 17.46031746031746, 1106.8412698412703, 429, 5940, 755.0, 1639.0000000000005, 4489.7999999999965, 5940.0, 0.2739833261575796, 79.1373563286343, 0.9968887059615292], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 153.83636363636364, 84, 399, 88.0, 339.8, 353.3999999999998, 399.0, 0.23871527777777776, 0.1774046156141493, 0.11539459228515625], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 486.8181818181818, 412, 733, 429.0, 594.4, 666.2, 733.0, 0.23855789583261042, 70.14394224242254, 0.11997784800175232], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 118.36363636363637, 83, 263, 87.0, 251.4, 254.0, 263.0, 0.23889673145835597, 0.42273523183841893, 0.11618219947877077], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 647.9818181818182, 573, 1083, 585.0, 751.4, 807.5999999999995, 1083.0, 0.23855893056200148, 214.65574506155906, 0.11974540069225464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 91.44444444444446, 86, 115, 89.5, 102.40000000000002, 115.0, 115.0, 0.1025635181565917, 0.07662215956034438, 0.03645812559472596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 11, 6.077348066298343, 255.31491712707196, 85, 5099, 90.0, 379.2000000000009, 524.7000000000004, 4712.780000000003, 0.7243679789332981, 1.5342364233530634, 0.35043583390362304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 106.66666666666667, 86, 254, 88.0, 254.0, 254.0, 254.0, 0.05329259410583909, 0.04127053430266641, 0.01894385181105999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d083e3c-9f99-4d0c-9861-c40de6c4f230", 3, 0, 0.0, 494.3333333333333, 225, 833, 425.0, 833.0, 833.0, 833.0, 0.06478781988986071, 0.030031854011445848, 0.04154687668718281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 104.73684210526315, 85, 349, 88.0, 111.0, 349.0, 349.0, 0.1016901981353229, 0.08252397915083332, 0.03614768761841556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 256.1111111111111, 170, 424, 174.0, 424.0, 424.0, 424.0, 0.051535175620426255, 0.07986945674767233, 0.11590381782601725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/402d38fd-42f1-4858-93e1-d922987766be", 3, 0, 0.0, 639.6666666666667, 189, 1423, 307.0, 1423.0, 1423.0, 1423.0, 0.03558043550453058, 0.02966194509345794, 0.022816880841121493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2cf5f6b-97ae-4a34-8b51-51bb96df5492", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.25374166081460675, 0.9683330407303371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 249.7058823529412, 170, 592, 178.0, 536.8, 592.0, 592.0, 0.1023079469202299, 0.15855733570547348, 0.23009297046610297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46673f59-300f-4bef-8a5d-07677ecd8c9d", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 87.8, 85, 91, 88.0, 91.0, 91.0, 91.0, 0.07158537749355731, 0.05935154833206071, 0.02544636465591295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 152.26666666666668, 86, 872, 88.0, 502.4000000000002, 872.0, 872.0, 0.07590977869769185, 0.05893386139127442, 0.026983554146445144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3dc24ef7-994a-4397-b1a3-7a441db1612e", 3, 0, 0.0, 458.6666666666667, 214, 650, 512.0, 650.0, 650.0, 650.0, 0.02915395230413403, 0.029239364273775048, 0.018695731132533866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2650df45-6a26-4c7d-bc37-36904821ab26", 3, 0, 0.0, 1838.3333333333335, 386, 3366, 1763.0, 3366.0, 3366.0, 3366.0, 0.03785632263681906, 0.03155925855237422, 0.024276352732595555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 85.55555555555556, 83, 89, 85.0, 89.0, 89.0, 89.0, 0.09533645825057599, 0.07085062961785969, 0.04785443314530865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 112.72222222222221, 82, 253, 85.0, 252.1, 253.0, 253.0, 0.09533746815463737, 0.04142048855155903, 0.053482498953936114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 196.72222222222223, 83, 759, 88.0, 745.5, 759.0, 759.0, 0.09533595330656865, 9.554336279699797, 0.05513678723133798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 187.66666666666666, 83, 597, 86.5, 585.3000000000001, 597.0, 597.0, 0.09533847808009491, 3.137583520479235, 0.055231351396443876], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 28.125, 0.6593406593406593], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.21978021978021978], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.21978021978021978], "isController": false}, {"data": ["401/Unauthorized", 17, 53.125, 1.2454212454212454], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1365, 32, "401/Unauthorized", 17, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
