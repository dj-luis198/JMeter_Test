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

    var data = {"OkPercent": 98.17767653758543, "KoPercent": 1.8223234624145785};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.787109375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ebf8fe2-23d8-412d-bbab-ea4449548cc2"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcb7a215-ab7e-4bc8-bd74-4807e3e6666b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f382e106-6782-4045-9ed5-3a0e07f754b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e42bf11-7305-4e0c-b5d7-478cd7411143"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9086ffc-446d-4548-a1bc-cc1a1c781917"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddf7e70e-730e-4636-b53a-2cd8f5978c94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7454e235-19e5-4d3e-9464-1bfd81e09462"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecb46b83-60ae-45cd-baac-9cb6e66652d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a1909e4-23d0-442e-bf51-777a3771d144"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a8b1ab6-3058-4e85-a64e-1ed020a57202"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd4c8602-643d-400d-89b8-e109a2be30ae"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ebf8fe2-23d8-412d-bbab-ea4449548cc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/138e0427-e1c4-440a-a9c3-0c508bb6b3a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd4b5630-486a-4323-8c9a-18fe681347b3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3e42bf11-7305-4e0c-b5d7-478cd7411143"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ea76954-5855-4b7c-bbf3-a53eaba91c8d"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/518d89ca-243e-482a-88c9-9155a625ce4d"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d9086ffc-446d-4548-a1bc-cc1a1c781917"], "isController": false}, {"data": [0.288135593220339, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b70a090b-eddf-4b4e-97b2-542ee4575941"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f382e106-6782-4045-9ed5-3a0e07f754b8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9cec84b7-3550-40c2-8ae6-f0a5d00dcea0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ddf7e70e-730e-4636-b53a-2cd8f5978c94"], "isController": false}, {"data": [0.9228571428571428, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cec84b7-3550-40c2-8ae6-f0a5d00dcea0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b70a090b-eddf-4b4e-97b2-542ee4575941"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7454e235-19e5-4d3e-9464-1bfd81e09462"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dcb7a215-ab7e-4bc8-bd74-4807e3e6666b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd4b5630-486a-4323-8c9a-18fe681347b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd4c8602-643d-400d-89b8-e109a2be30ae"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a8b1ab6-3058-4e85-a64e-1ed020a57202"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ecb46b83-60ae-45cd-baac-9cb6e66652d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 24, 1.8223234624145785, 344.23158694001506, 105, 2888, 124.0, 877.2, 1017.3999999999996, 1457.0999999999997, 5.194672009908137, 730.0416461849533, 3.791575772643366], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9ebf8fe2-23d8-412d-bbab-ea4449548cc2", 3, 0, 0.0, 440.3333333333333, 272, 638, 411.0, 638.0, 638.0, 638.0, 0.04172113592746085, 0.026822670396072647, 0.026754764901399046], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1599.3508771929826, 1291, 2090, 1566.0, 1912.2, 1935.1999999999998, 2090.0, 0.24158274844878447, 290.7065730838144, 1.187860486757451], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 496.4666666666667, 114, 941, 420.0, 900.2, 941.0, 941.0, 0.07583072559893635, 0.014855120659322882, 0.051057380478138], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 496.4666666666667, 114, 941, 420.0, 900.2, 941.0, 941.0, 0.0780672627535885, 0.015293254793329934, 0.05256325725244871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcb7a215-ab7e-4bc8-bd74-4807e3e6666b", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 168.73333333333335, 108, 338, 111.0, 332.0, 338.0, 338.0, 0.083492432802507, 0.030700863311755176, 0.0471493074302699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 140.93333333333334, 109, 330, 113.0, 328.8, 330.0, 330.0, 0.08349103862852054, 0.06204753944951575, 0.0419085877490816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 155.13333333333333, 107, 776, 112.0, 378.80000000000024, 776.0, 776.0, 0.08349150334800928, 1.657621608853439, 0.04868707001875776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 242.66666666666669, 108, 985, 114.0, 594.4000000000002, 985.0, 985.0, 0.08349057391420509, 5.029334108752039, 0.04860499426698059], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 212.0666666666667, 112, 278, 207.0, 274.4, 278.0, 278.0, 0.07606953770006288, 0.12692123126153723, 0.04916786264884273], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 148.94736842105266, 107, 345, 114.0, 337.0, 345.0, 345.0, 0.10744540077134487, 0.07984956053417329, 0.053932554684053974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 160.1578947368421, 107, 347, 112.0, 343.0, 347.0, 347.0, 0.10744722362029281, 0.045737968031623416, 0.06032861178187083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 772.0, 735, 785, 784.0, 785.0, 785.0, 785.0, 0.02199578780663503, 6.467491944042716, 0.01254447273347154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 865.5, 749, 998, 857.5, 998.0, 998.0, 998.0, 0.022000022000021997, 19.795658467533467, 0.01252540315040315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 217.75, 110, 328, 216.5, 328.0, 328.0, 328.0, 0.02205168915938961, 0.039021153082826145, 0.012210261477904208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f382e106-6782-4045-9ed5-3a0e07f754b8", 3, 0, 0.0, 318.0, 232, 459, 263.0, 459.0, 459.0, 459.0, 0.09108297659167502, 0.04121267495521754, 0.05840933069192702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e42bf11-7305-4e0c-b5d7-478cd7411143", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 124.7777777777778, 108, 328, 113.5, 139.00000000000028, 328.0, 328.0, 0.09035554908565203, 0.06714899692791133, 0.045354250224633935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 228.38888888888886, 106, 431, 224.5, 349.10000000000014, 431.0, 431.0, 0.09025904345471504, 0.031682726299479505, 0.05105473020067594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 196.72222222222223, 107, 758, 111.0, 380.00000000000057, 758.0, 758.0, 0.09025497029107228, 4.534729556309073, 0.05262914608769775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 183.77777777777777, 105, 751, 114.0, 379.3000000000006, 751.0, 751.0, 0.09035917773148264, 1.4990348353454983, 0.05277815253131196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 110.0, 109, 111, 110.0, 111.0, 111.0, 111.0, 0.02207749199690915, 0.016407198642234243, 0.012397029197483166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9086ffc-446d-4548-a1bc-cc1a1c781917", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 666.6153846153846, 109, 1095, 757.0, 1066.2, 1095.0, 1095.0, 0.0797604731636685, 49.69257825921233, 0.042145069729059806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 204.78947368421052, 106, 981, 114.0, 780.0, 981.0, 981.0, 0.10731068136634736, 10.189914755077488, 0.06211620546606723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 551.3846153846155, 106, 903, 554.0, 901.8, 903.0, 903.0, 0.0797604731636685, 16.242772186449308, 0.042222960816133706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 217.94736842105263, 106, 795, 112.0, 556.0, 795.0, 795.0, 0.10731189354660159, 3.3472750545031458, 0.06222170390106973], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 404.46666666666664, 115, 673, 412.0, 653.8, 673.0, 673.0, 0.0782162522943434, 0.015322441611567662, 0.05318297779701318], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 391.8333333333333, 222, 870, 440.5, 771.0000000000001, 870.0, 870.0, 0.09020386072523903, 6.127319421580271, 0.20158840228917352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddf7e70e-730e-4636-b53a-2cd8f5978c94", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7454e235-19e5-4d3e-9464-1bfd81e09462", 3, 0, 0.0, 320.3333333333333, 216, 492, 253.0, 492.0, 492.0, 492.0, 0.047875141630627324, 0.030389494199128675, 0.03070118131911974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 627.0000000000002, 172, 1041, 689.0, 1015.4, 1039.0, 1041.0, 0.08942715519444018, 0.05493132872783484, 0.04043434849123614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 111.23076923076924, 108, 114, 111.0, 113.6, 114.0, 114.0, 0.0797585157553745, 0.05927366258773437, 0.04003503622877197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 237.00000000000003, 109, 439, 319.0, 398.59999999999997, 439.0, 439.0, 0.07975900509844101, 0.1042762713892178, 0.040850127461025454], "isController": false}, {"data": ["login", 21, 0, 0.0, 2441.47619047619, 1500, 4431, 2463.0, 3488.4, 4340.299999999998, 4431.0, 0.09191860388771923, 21.073818914331863, 0.1677181110836328], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecb46b83-60ae-45cd-baac-9cb6e66652d8", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 141.0, 115, 326, 118.0, 324.0, 326.0, 326.0, 0.10556787180726641, 0.0854646149689686, 0.03752607943148922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 801.5384615384615, 225, 1209, 901.0, 1180.2, 1209.0, 1209.0, 0.07970374730233472, 66.05189403693349, 0.16513739891418971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a1909e4-23d0-442e-bf51-777a3771d144", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a8b1ab6-3058-4e85-a64e-1ed020a57202", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.2684458580980683, 1.0244474368499257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd4c8602-643d-400d-89b8-e109a2be30ae", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.28184721138845553, 1.0755898985959438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ebf8fe2-23d8-412d-bbab-ea4449548cc2", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/138e0427-e1c4-440a-a9c3-0c508bb6b3a6", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.8944984243697479, 1.671371673669468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd4b5630-486a-4323-8c9a-18fe681347b3", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 551.5, 112, 1109, 504.0, 1109.0, 1109.0, 1109.0, 0.043964740278296804, 26.30443899617507, 0.06413313553779869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 399.8666666666666, 222, 1099, 230.0, 842.2000000000002, 1099.0, 1099.0, 0.08343855862671258, 6.7754608415891155, 0.1862320381119523], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1057.9545454545455, 464, 2017, 892.0, 1631.6, 1959.999999999999, 2017.0, 0.09006869785227095, 0.02862623742108754, 0.04063646328881756], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3e42bf11-7305-4e0c-b5d7-478cd7411143", 3, 0, 0.0, 441.0, 198, 612, 513.0, 612.0, 612.0, 612.0, 0.05160402511395889, 0.03317641588543906, 0.03309242495914681], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 127.57894736842104, 108, 330, 117.0, 124.0, 330.0, 330.0, 0.09052015740978951, 0.07027688002029557, 0.032177087204261115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 405.0526315789474, 222, 1319, 233.0, 910.0, 1319.0, 1319.0, 0.10724223763750995, 13.653867167436175, 0.23830199731612187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ea76954-5855-4b7c-bbf3-a53eaba91c8d", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 351.25, 221, 1082, 237.0, 640.3000000000004, 1082.0, 1082.0, 0.10890502800901189, 8.301249865995766, 0.24318843717881525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 170.5, 113, 337, 116.0, 337.0, 337.0, 337.0, 0.02447755713979745, 0.018190840804087755, 0.012286586298687391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 164.25, 111, 319, 113.5, 319.0, 319.0, 319.0, 0.02444673972167387, 0.015720877057345938, 0.013428995208439013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 304.0, 107, 888, 110.5, 888.0, 888.0, 888.0, 0.024362167989329372, 5.4852051694236525, 0.01379888421270609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 301.0, 112, 860, 116.0, 860.0, 860.0, 860.0, 0.024366174876037087, 1.7960416958553136, 0.01382494883103276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 116.0, 115, 117, 116.0, 117.0, 117.0, 117.0, 0.08147303242626691, 0.024028179485090437, 0.050363700708815386], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1038.0877192982455, 843, 1614, 903.0, 1444.6, 1458.8999999999999, 1614.0, 0.2556512378902045, 305.8477592673574, 0.5048113310683531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1057.9545454545455, 464, 2017, 892.0, 1631.6, 1959.999999999999, 2017.0, 0.08753292431585062, 0.02782030087453349, 0.039492393587815415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 128.66666666666669, 110, 321, 111.0, 258.9000000000002, 321.0, 321.0, 0.06006126248773749, 0.016188387154897996, 0.03536810671885323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 129.41666666666669, 107, 326, 111.5, 263.0000000000002, 326.0, 326.0, 0.060061863719631216, 0.01618854920568185, 0.03530980660079882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 190.57894736842107, 107, 956, 113.0, 337.0, 956.0, 956.0, 0.09184112452206361, 4.372862012637822, 0.05357713627289382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/518d89ca-243e-482a-88c9-9155a625ce4d", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 1.6985954122340425, 3.173828125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 181.42105263157896, 107, 786, 111.0, 336.0, 786.0, 786.0, 0.09184512012374922, 1.4447951158940397, 0.05366915967757529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 124.47368421052632, 108, 335, 113.0, 116.0, 335.0, 335.0, 0.09184156846063864, 0.06825335312358008, 0.04610016229371901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 112.0, 108, 117, 111.5, 116.4, 117.0, 117.0, 0.06006066126788056, 0.0160709191283196, 0.034253345879338135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 136.10526315789474, 106, 344, 114.0, 334.0, 344.0, 344.0, 0.09184156846063864, 0.03183488577809144, 0.051972433632382374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 134.58333333333331, 110, 344, 114.0, 278.30000000000024, 344.0, 344.0, 0.06006036066246578, 0.044634701625133257, 0.030147485723151766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 118.41666666666666, 112, 145, 116.0, 137.8, 145.0, 145.0, 0.06429214350006429, 0.050604948887745915, 0.02285384788478848], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 485.1333333333334, 112, 865, 492.0, 764.2, 865.0, 865.0, 0.07697241821680564, 0.014798147851186659, 0.05238233643361129], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1240.8095238095239, 819, 2888, 1104.0, 1654.4, 2767.499999999998, 2888.0, 0.08958585737931506, 0.046367680088903296, 0.04120599494693104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 266.91666666666663, 225, 670, 227.5, 541.9000000000004, 670.0, 670.0, 0.06002671188678962, 0.09302967945735853, 0.13500148190944972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9086ffc-446d-4548-a1bc-cc1a1c781917", 3, 0, 0.0, 1177.0, 263, 2587, 681.0, 2587.0, 2587.0, 2587.0, 0.047949365470063614, 0.03113899222421123, 0.03074877928907074], "isController": false}, {"data": ["addBook", 59, 12, 20.338983050847457, 1029.64406779661, 572, 1849, 893.0, 1598.0, 1757.0, 1849.0, 0.28143752563943564, 92.38372180556483, 1.0217389619248418], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b70a090b-eddf-4b4e-97b2-542ee4575941", 3, 0, 0.0, 303.6666666666667, 230, 402, 279.0, 402.0, 402.0, 402.0, 0.08830022075055188, 0.03995355040470935, 0.05662481604120677], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 195.8245614035088, 108, 462, 115.0, 455.2, 459.2, 462.0, 0.25653027057192745, 0.19064407803245784, 0.12400633196592198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f382e106-6782-4045-9ed5-3a0e07f754b8", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 622.5087719298245, 525, 887, 558.0, 782.2, 868.5999999999999, 887.0, 0.25646678755101215, 75.40975103880298, 0.1289847613171594], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 185.10526315789477, 107, 433, 117.0, 339.8, 345.2, 433.0, 0.2569836432165335, 0.45474058741050655, 0.12497837336116571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cec84b7-3550-40c2-8ae6-f0a5d00dcea0", 3, 0, 0.0, 427.6666666666667, 269, 522, 492.0, 522.0, 522.0, 522.0, 0.047338025057594595, 0.0294475800407107, 0.030356741329251744], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 832.859649122807, 734, 1148, 775.0, 1002.8000000000001, 1030.9999999999995, 1148.0, 0.25622814194140014, 230.55453251990264, 0.12861451656042938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 117.81250000000001, 112, 129, 116.5, 126.2, 129.0, 129.0, 0.10750087344459675, 0.08031071111827782, 0.038213201107258996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddf7e70e-730e-4636-b53a-2cd8f5978c94", 3, 0, 0.0, 273.0, 199, 413, 207.0, 413.0, 413.0, 413.0, 0.019239402295902007, 0.02274032217982428, 0.012337767748348617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, 6.857142857142857, 167.98285714285717, 108, 913, 118.0, 293.6000000000001, 368.9999999999997, 742.000000000002, 0.7510407278657568, 1.6198129573301576, 0.36000081139221496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 125.0, 114, 137, 124.5, 137.0, 137.0, 137.0, 0.02542394427071416, 0.01968865996745735, 0.009037417689980424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cec84b7-3550-40c2-8ae6-f0a5d00dcea0", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b70a090b-eddf-4b4e-97b2-542ee4575941", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 115.39999999999999, 109, 124, 116.0, 120.4, 124.0, 124.0, 0.085862459787748, 0.06967939851915878, 0.030521421252676047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 479.75, 228, 1226, 232.5, 1226.0, 1226.0, 1226.0, 0.024345116369656247, 7.30960335909351, 0.05319550573936118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 364.2631578947368, 219, 1069, 232.0, 672.0, 1069.0, 1069.0, 0.09178921331813175, 5.914337188279, 0.20520003254893812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7454e235-19e5-4d3e-9464-1bfd81e09462", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcb7a215-ab7e-4bc8-bd74-4807e3e6666b", 3, 0, 0.0, 454.66666666666663, 203, 865, 296.0, 865.0, 865.0, 865.0, 0.022797738464344335, 0.02694615506641741, 0.014619643481366648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd4b5630-486a-4323-8c9a-18fe681347b3", 3, 0, 0.0, 386.66666666666663, 205, 697, 258.0, 697.0, 697.0, 697.0, 0.0387131740931439, 0.03227358035564503, 0.024825831042803868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 129.05555555555557, 112, 341, 116.5, 144.8000000000003, 341.0, 341.0, 0.09000270008100243, 0.07462137926637799, 0.03199314729441883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 119.30769230769232, 111, 143, 117.0, 137.79999999999998, 143.0, 143.0, 0.08260051847710059, 0.06412833221610838, 0.029361903052406855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd4c8602-643d-400d-89b8-e109a2be30ae", 3, 0, 0.0, 505.0, 193, 909, 413.0, 909.0, 909.0, 909.0, 0.019335378586712727, 0.026655380310783985, 0.012399315044213564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a8b1ab6-3058-4e85-a64e-1ed020a57202", 3, 0, 0.0, 359.0, 205, 594, 278.0, 594.0, 594.0, 594.0, 0.035386121563122944, 0.02915438596232558, 0.02269227196593496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecb46b83-60ae-45cd-baac-9cb6e66652d8", 3, 0, 0.0, 304.6666666666667, 190, 363, 361.0, 363.0, 363.0, 363.0, 0.0330138327959415, 0.027522274020314513, 0.021170980015626548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 112.74999999999999, 107, 127, 111.5, 123.5, 127.0, 127.0, 0.10899256806926479, 0.08099935966866259, 0.05470916014414267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 141.12499999999997, 105, 345, 112.5, 341.5, 345.0, 345.0, 0.10898811348387318, 0.039393774905486866, 0.061585202309185655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 193.625, 106, 974, 111.5, 527.4000000000004, 974.0, 974.0, 0.10899034073105271, 6.156896544750753, 0.06348900219343061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 207.1875, 110, 523, 115.5, 395.60000000000014, 523.0, 523.0, 0.108986628702991, 2.030394816834347, 0.06359327211917688], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 16.666666666666668, 0.30372057706909644], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.15186028853454822], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.15186028853454822], "isController": false}, {"data": ["401/Unauthorized", 16, 66.66666666666667, 1.2148823082763858], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 24, "401/Unauthorized", 16, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
