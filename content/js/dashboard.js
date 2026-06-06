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

    var data = {"OkPercent": 97.71891096394408, "KoPercent": 2.2810890360559233};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7425679949399114, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a79e412-ce13-4f02-8b8f-5154aafb965b"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c29fff86-7943-4edb-8c03-7d78d4f9e7ea"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f22230e-7d8e-4152-bfe8-e7c0283589c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/972a69cd-5723-481c-82bb-2189116d9cba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4923cbcb-d0e4-40d0-8566-ca436a05a5f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c8f3a26-a675-40c7-8359-915637f3a609"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8c85d31-b74c-4091-80e7-e4ef0b5c00c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad15050f-2c6f-454b-b5f1-395ad646b893"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=639faeeb-463d-4dee-83ce-ee78331b5b06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5c8f3a26-a675-40c7-8359-915637f3a609"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/86b830a3-766c-4c88-892b-08f4f52b521b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/269c8baf-a239-473c-b004-5867e91d929b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b1d2c68-db32-4783-8462-32487760e51c"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e038b4fc-62c2-4d7c-ab56-aa76e7c5d78d"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bed55c24-2e55-4f36-9e95-35ed8941a889"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8c85d31-b74c-4091-80e7-e4ef0b5c00c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86b830a3-766c-4c88-892b-08f4f52b521b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8154c470-a80f-45ab-9b8c-54ac217ee5fb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4923cbcb-d0e4-40d0-8566-ca436a05a5f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=269c8baf-a239-473c-b004-5867e91d929b"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c29fff86-7943-4edb-8c03-7d78d4f9e7ea"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1a79e412-ce13-4f02-8b8f-5154aafb965b"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8978494623655914, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f22230e-7d8e-4152-bfe8-e7c0283589c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8154c470-a80f-45ab-9b8c-54ac217ee5fb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad15050f-2c6f-454b-b5f1-395ad646b893"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/639faeeb-463d-4dee-83ce-ee78331b5b06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e038b4fc-62c2-4d7c-ab56-aa76e7c5d78d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1359, 31, 2.2810890360559233, 429.44591611479024, 126, 4721, 143.0, 1175.0, 1449.0, 1971.6000000000026, 5.262057429606914, 707.470979912996, 3.8532897175951737], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2087.517857142858, 1597, 2995, 2091.5, 2591.1000000000004, 2714.1499999999996, 2995.0, 0.25097589286914745, 302.0080881253109, 1.234046504488435], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a79e412-ce13-4f02-8b8f-5154aafb965b", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 611.5, 137, 1438, 528.0, 1248.0, 1438.0, 1438.0, 0.0711866819887525, 0.014022822958721894, 0.04789807020532273], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 611.5, 137, 1438, 528.0, 1248.0, 1438.0, 1438.0, 0.07337564662288586, 0.014454019675155529, 0.0493709184796566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c29fff86-7943-4edb-8c03-7d78d4f9e7ea", 1, 0, 0.0, 994.0, 994, 994, 994.0, 994.0, 994.0, 994.0, 1.006036217303823, 0.18175459004024144, 0.6936148138832998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 222.3846153846154, 126, 512, 133.0, 467.99999999999994, 512.0, 512.0, 0.06954065721270347, 0.026641928469410135, 0.03921065001792009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 133.30769230769226, 129, 137, 133.0, 136.6, 137.0, 137.0, 0.06953916927438551, 0.05167901154082752, 0.03490540332718179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 223.8461538461538, 127, 777, 133.0, 624.5999999999999, 777.0, 777.0, 0.0695432612579841, 1.590227449928852, 0.04049202358853927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 295.2307692307693, 132, 1446, 134.0, 1027.1999999999996, 1446.0, 1446.0, 0.06954140120574091, 4.830646001168831, 0.04042302903620967], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 259.73333333333335, 131, 437, 257.0, 422.0, 437.0, 437.0, 0.07469859118457026, 0.13558086091371319, 0.04827688246674668], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f22230e-7d8e-4152-bfe8-e7c0283589c5", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 147.74999999999997, 132, 400, 134.0, 143.3, 387.1999999999998, 400.0, 0.09723653760136909, 0.07226270030726746, 0.04880818391318722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/972a69cd-5723-481c-82bb-2189116d9cba", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 176.44999999999996, 127, 469, 133.0, 397.7, 465.44999999999993, 469.0, 0.09711425005948247, 0.03327870150964102, 0.05497766675730663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 882.1666666666666, 661, 1069, 865.5, 1069.0, 1069.0, 1069.0, 0.04095842719639566, 12.043137543518329, 0.023359103010444398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1320.1666666666667, 1184, 1456, 1326.5, 1456.0, 1456.0, 1456.0, 0.04081799257112535, 36.72810146587616, 0.02323915006734969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 357.16666666666663, 134, 407, 399.0, 407.0, 407.0, 407.0, 0.04111137757374353, 0.07274786734728836, 0.022763819418274007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4923cbcb-d0e4-40d0-8566-ca436a05a5f1", 3, 0, 0.0, 320.0, 226, 477, 257.0, 477.0, 477.0, 477.0, 0.01713776477846583, 0.02362579226458424, 0.010990037960148984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 133.99999999999997, 130, 136, 134.0, 136.0, 136.0, 136.0, 0.08390528771123157, 0.062355394480710175, 0.04211652137067678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c8f3a26-a675-40c7-8359-915637f3a609", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 203.46666666666664, 132, 399, 134.0, 397.8, 399.0, 399.0, 0.08390575705367731, 0.03085284608327926, 0.04738271723200502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 263.33333333333337, 127, 1033, 134.0, 653.2000000000003, 1033.0, 1033.0, 0.08378016085790885, 5.04677834736651, 0.04877358062444147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 264.8666666666666, 131, 1053, 135.0, 664.8000000000002, 1053.0, 1053.0, 0.08378952072394145, 1.6635383790917215, 0.048860855281532785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8c85d31-b74c-4091-80e7-e4ef0b5c00c2", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 133.83333333333334, 131, 136, 134.0, 136.0, 136.0, 136.0, 0.04118276912939626, 0.030605554011201713, 0.023125090087307468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 186.1, 130, 922, 133.5, 371.7000000000005, 895.7499999999995, 922.0, 0.09723890139489204, 4.3996851966535235, 0.056748015110925275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 805.6315789473686, 126, 1689, 1045.0, 1585.0, 1689.0, 1689.0, 0.08755316550773923, 41.4745951098101, 0.0475116324748515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 218.3, 127, 793, 133.0, 401.7, 773.4499999999997, 793.0, 0.09711330695088495, 1.4525931529049019, 0.05676955619218724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 638.7894736842105, 132, 1189, 786.0, 1185.0, 1189.0, 1189.0, 0.08755518280600537, 13.560720959328313, 0.04759823029086754], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 577.9999999999999, 135, 1581, 498.5, 1341.5, 1581.0, 1581.0, 0.07339372588491865, 0.014457581047643012, 0.049854080822219426], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 453.66666666666663, 268, 1185, 524.0, 798.0000000000002, 1185.0, 1185.0, 0.08371750365566433, 6.798112013322245, 0.1868546339731211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 607.9523809523808, 161, 1815, 560.0, 977.6, 1732.199999999999, 1815.0, 0.08969107830031135, 0.05509344555751547, 0.040553680911175935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 160.89473684210526, 132, 399, 134.0, 382.0, 399.0, 399.0, 0.08755356895995577, 0.06506666599465463, 0.043947787544352794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 261.05263157894734, 131, 408, 142.0, 407.0, 408.0, 408.0, 0.0875539724158906, 0.09263908697335134, 0.04606303770811349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad15050f-2c6f-454b-b5f1-395ad646b893", 3, 0, 0.0, 490.66666666666663, 261, 784, 427.0, 784.0, 784.0, 784.0, 0.01875574394658364, 0.025856307165944573, 0.012027609236578703], "isController": false}, {"data": ["login", 21, 0, 0.0, 2959.4285714285716, 1744, 4379, 3000.0, 4224.6, 4367.4, 4379.0, 0.0886472430707405, 30.421389023149594, 0.17574860090377975], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=639faeeb-463d-4dee-83ce-ee78331b5b06", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 153.85, 134, 405, 137.0, 168.50000000000003, 393.24999999999983, 405.0, 0.09331753156465504, 0.0755471031905264, 0.033171466298373475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c8f3a26-a675-40c7-8359-915637f3a609", 3, 0, 0.0, 703.6666666666666, 222, 1329, 560.0, 1329.0, 1329.0, 1329.0, 0.08921137147615082, 0.04036582238015939, 0.05720911517188058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86b830a3-766c-4c88-892b-08f4f52b521b", 3, 0, 0.0, 569.6666666666666, 235, 958, 516.0, 958.0, 958.0, 958.0, 0.061581410624846046, 0.03959091340627309, 0.039490683245750884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1004.2105263157894, 269, 1826, 1220.0, 1719.0, 1826.0, 1826.0, 0.0874979276806602, 55.15788680847855, 0.18500217161797483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/269c8baf-a239-473c-b004-5867e91d929b", 3, 0, 0.0, 369.0, 299, 503, 305.0, 503.0, 503.0, 503.0, 0.06765289554392928, 0.03061117343947321, 0.04338418106169944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b1d2c68-db32-4783-8462-32487760e51c", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 492.3846153846153, 265, 1579, 526.0, 1162.1999999999996, 1579.0, 1579.0, 0.06948936010990009, 6.494290179549815, 0.1549155453712068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 854.090909090909, 131, 1592, 1319.0, 1588.2, 1592.0, 1592.0, 0.07082973818753138, 46.228791825765285, 0.10833856172167777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e038b4fc-62c2-4d7c-ab56-aa76e7c5d78d", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1275.826086956522, 163, 4721, 1078.0, 2891.000000000002, 4450.199999999996, 4721.0, 0.09138261902586128, 0.028650189320947678, 0.04122926756830851], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 388.8, 267, 1056, 271.0, 772.6000000000006, 1043.1499999999999, 1056.0, 0.09704968944099378, 5.948146085561432, 0.21702547251067544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 155.5, 134, 399, 138.0, 226.80000000000018, 399.0, 399.0, 0.13113679206622408, 0.1018103024342267, 0.04661503155479059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bed55c24-2e55-4f36-9e95-35ed8941a889", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.5827298129562043, 1.0888315465328466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 435.77777777777777, 266, 1582, 272.0, 714.4000000000013, 1582.0, 1582.0, 0.1339764201500536, 9.100678337036292, 0.29941171326068833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 135.11111111111114, 133, 138, 135.0, 138.0, 138.0, 138.0, 0.046083421233192354, 0.03424754253755799, 0.023131717298692255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 133.88888888888889, 131, 137, 134.0, 137.0, 137.0, 137.0, 0.046083657199035316, 0.012330978586460623, 0.02628208574632483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8c85d31-b74c-4091-80e7-e4ef0b5c00c2", 3, 0, 0.0, 520.0, 309, 779, 472.0, 779.0, 779.0, 779.0, 0.058557151780137415, 0.03764660636906621, 0.03755129850484072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 133.55555555555554, 129, 140, 133.0, 140.0, 140.0, 140.0, 0.046083657199035316, 0.012420985729427488, 0.027092150033026622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 164.22222222222223, 128, 403, 134.0, 403.0, 403.0, 403.0, 0.04602026937197673, 0.012403900729165602, 0.027099826593068324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 136.0, 135, 137, 136.0, 137.0, 137.0, 137.0, 0.017786947937603388, 0.005245760036285374, 0.010995251996584906], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1437.6785714285709, 1012, 2458, 1315.0, 2028.3000000000006, 2145.2, 2458.0, 0.2492588998780412, 298.200300668548, 0.49218896050136646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1275.826086956522, 163, 4721, 1078.0, 2891.000000000002, 4450.199999999996, 4721.0, 0.09094755489475786, 0.02851378844017035, 0.04103297886853333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 132.27272727272728, 126, 136, 134.0, 135.8, 136.0, 136.0, 0.05468012129045086, 0.014738001441566836, 0.03219932923646667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86b830a3-766c-4c88-892b-08f4f52b521b", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 132.27272727272725, 127, 136, 133.0, 136.0, 136.0, 136.0, 0.05467957767482552, 0.014737854920167817, 0.032145611093989224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8154c470-a80f-45ab-9b8c-54ac217ee5fb", 3, 0, 0.0, 444.6666666666667, 318, 579, 437.0, 579.0, 579.0, 579.0, 0.023208317861121427, 0.0274314460135846, 0.014882938211721746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4923cbcb-d0e4-40d0-8566-ca436a05a5f1", 1, 0, 0.0, 1581.0, 1581, 1581, 1581.0, 1581.0, 1581.0, 1581.0, 0.6325110689437066, 0.1142720192915876, 0.4360867330803289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 214.9375, 127, 403, 134.0, 400.2, 403.0, 403.0, 0.1322346835045497, 0.03564137953833566, 0.07773953073216691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 182.3125, 130, 397, 133.0, 395.6, 397.0, 397.0, 0.13223359063786178, 0.035641084976611184, 0.07786802261194399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 181.36363636363637, 132, 402, 134.0, 400.4, 402.0, 402.0, 0.05460954177629946, 0.014612318795611378, 0.031144504294295786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 134.81250000000003, 132, 142, 134.5, 138.5, 142.0, 142.0, 0.13223577638930212, 0.09827287678931536, 0.06637616119541143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 134.63636363636363, 127, 155, 134.0, 151.20000000000002, 155.0, 155.0, 0.054673870363283014, 0.04063165561177576, 0.027443720084694794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 198.0, 128, 396, 134.5, 395.3, 396.0, 396.0, 0.13223249778923793, 0.03538252382251093, 0.07541384639542476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 195.9090909090909, 133, 503, 137.0, 484.80000000000007, 503.0, 503.0, 0.05498625343664084, 0.04328019557610597, 0.019545894776305923], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 538.857142857143, 133, 950, 538.0, 867.0, 950.0, 950.0, 0.07199424046076314, 0.013900673660392882, 0.048993848349274914], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=269c8baf-a239-473c-b004-5867e91d929b", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1520.3809523809523, 781, 2096, 1476.0, 2075.4, 2095.4, 2096.0, 0.08826533400022697, 0.04568420607433622, 0.04059860577549502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 317.18181818181813, 261, 535, 269.0, 533.6, 535.0, 535.0, 0.054567281458037756, 0.08456862858779875, 0.12272309491978609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c29fff86-7943-4edb-8c03-7d78d4f9e7ea", 3, 0, 0.0, 1015.6666666666666, 412, 2043, 592.0, 2043.0, 2043.0, 2043.0, 0.04184333854050435, 0.03488306966218478, 0.02683313050937291], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a79e412-ce13-4f02-8b8f-5154aafb965b", 3, 0, 0.0, 463.6666666666667, 226, 595, 570.0, 595.0, 595.0, 595.0, 0.021697935803040604, 0.025646225553658995, 0.013914366384111325], "isController": false}, {"data": ["addBook", 65, 15, 23.076923076923077, 1227.276923076923, 674, 2633, 1072.0, 2098.8, 2319.2, 2633.0, 0.2967250682467657, 77.55923855639831, 1.081882958794018], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 248.4642857142857, 131, 542, 136.5, 535.0, 540.3, 542.0, 0.25085672049633795, 0.1864276995094855, 0.12126374672430398], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 848.4285714285713, 638, 1195, 792.0, 1057.9, 1185.3, 1195.0, 0.2503028217173455, 73.59734042077692, 0.1258847199066728], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 205.5178571428572, 128, 534, 136.0, 399.3, 424.74999999999983, 534.0, 0.2513397305279032, 0.4447535075357037, 0.12223357988564042], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1186.0, 877, 1949, 1177.5, 1579.2, 1609.3999999999999, 1949.0, 0.2498850974774992, 224.84704996140167, 0.12543060556976032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 155.72222222222223, 133, 434, 137.5, 193.7000000000004, 434.0, 434.0, 0.12929455454434444, 0.09659212326799169, 0.04596017368568493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 15, 8.064516129032258, 199.73655913978487, 130, 1053, 139.0, 353.0000000000001, 460.90000000000003, 829.4099999999988, 0.7713329545784416, 1.5391142720959936, 0.37408417170866837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 166.33333333333334, 133, 401, 137.0, 401.0, 401.0, 401.0, 0.04473005412336549, 0.034639582929520345, 0.015900136426665077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f22230e-7d8e-4152-bfe8-e7c0283589c5", 3, 0, 0.0, 344.0, 257, 451, 324.0, 451.0, 451.0, 451.0, 0.03739948887365206, 0.024044267749174092, 0.023983396185252134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 137.30769230769232, 133, 145, 136.0, 143.8, 145.0, 145.0, 0.07183828649108652, 0.058298453197356354, 0.025536265901128414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 300.66666666666674, 267, 537, 270.0, 537.0, 537.0, 537.0, 0.045988288315908885, 0.07127286480209706, 0.10342873827298649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 400.87500000000006, 266, 538, 402.5, 535.2, 538.0, 538.0, 0.13208730971171945, 0.20470953175048706, 0.2970674553379784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8154c470-a80f-45ab-9b8c-54ac217ee5fb", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad15050f-2c6f-454b-b5f1-395ad646b893", 1, 0, 0.0, 1102.0, 1102, 1102, 1102.0, 1102.0, 1102.0, 1102.0, 0.9074410163339383, 0.16394198049001812, 0.6256380444646098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 137.66666666666666, 134, 144, 136.0, 144.0, 144.0, 144.0, 0.09008954901171765, 0.07469338585053543, 0.032024019375259005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/639faeeb-463d-4dee-83ce-ee78331b5b06", 3, 0, 0.0, 316.3333333333333, 226, 491, 232.0, 491.0, 491.0, 491.0, 0.039782522211908235, 0.03307440160456173, 0.02551157837156876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 138.31578947368425, 129, 148, 137.0, 148.0, 148.0, 148.0, 0.08885563297946968, 0.06898459786980311, 0.03158540078567086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e038b4fc-62c2-4d7c-ab56-aa76e7c5d78d", 3, 0, 0.0, 599.0, 347, 950, 500.0, 950.0, 950.0, 950.0, 0.022566910890791197, 0.026805552682453476, 0.01447161928869097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 139.33333333333331, 131, 220, 134.0, 148.0000000000001, 220.0, 220.0, 0.13437448676411304, 0.09986228947997074, 0.06744969355151768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 191.00000000000003, 132, 397, 134.0, 397.0, 397.0, 397.0, 0.13410917977335549, 0.0470749996274745, 0.07585841516476803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 235.88888888888886, 130, 1449, 133.0, 504.90000000000146, 1449.0, 1449.0, 0.13437348363256316, 6.751400015396961, 0.07835537120674853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 227.61111111111114, 128, 783, 133.5, 443.70000000000056, 783.0, 783.0, 0.1343754899106403, 2.2292538007734057, 0.07848776716460251], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 22.580645161290324, 0.515084621044886], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.22075055187637968], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.14716703458425312], "isController": false}, {"data": ["401/Unauthorized", 19, 61.29032258064516, 1.3980868285504047], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1359, 31, "401/Unauthorized", 19, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
