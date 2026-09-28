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

    var data = {"OkPercent": 97.1830985915493, "KoPercent": 2.816901408450704};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7180174146014735, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4e6a174-956b-44e8-84d0-aca231cf33a3"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eef392ea-070e-4bde-be43-8115fe1f72ac"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7dd33b94-09dc-46a7-a17e-0f9467652ad5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/942b81c4-0411-400a-92fd-012a445ce6c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4c2a6fe-ef94-4641-977e-1b335404c3be"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7d62935f-9ef0-4efa-9fe1-ab49e11b192c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b60039b-9778-497e-ab44-88defd6604ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80e1d01d-772b-42e7-a249-58bc36f24073"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0186274-803e-48ca-bd05-73904b3a1601"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3be4d6d1-7d93-487c-878f-1d22896daf96"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9526f4ce-7ff6-4878-8641-079a0dad9039"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b03de643-a25c-408c-8545-905c665643a3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e4e6a174-956b-44e8-84d0-aca231cf33a3"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07692307692307693, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44614b22-c265-4c56-b1a1-a6f80c0baff4"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9526f4ce-7ff6-4878-8641-079a0dad9039"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.21052631578947367, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38c72bb2-7a67-4210-b198-5808d521b8ff"], "isController": false}, {"data": [0.3148148148148148, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7dd33b94-09dc-46a7-a17e-0f9467652ad5"], "isController": false}, {"data": [0.8779761904761905, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eef392ea-070e-4bde-be43-8115fe1f72ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80e1d01d-772b-42e7-a249-58bc36f24073"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d62935f-9ef0-4efa-9fe1-ab49e11b192c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4c2a6fe-ef94-4641-977e-1b335404c3be"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0186274-803e-48ca-bd05-73904b3a1601"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=942b81c4-0411-400a-92fd-012a445ce6c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44614b22-c265-4c56-b1a1-a6f80c0baff4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b03de643-a25c-408c-8545-905c665643a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b60039b-9778-497e-ab44-88defd6604ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1278, 36, 2.816901408450704, 479.14084507042213, 135, 3950, 152.0, 1391.1000000000001, 1662.05, 2155.63, 5.0540402662269095, 703.4879470976838, 3.700395891170062], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2345.425925925927, 1678, 3312, 2366.5, 2815.0, 3014.75, 3312.0, 0.23588099367052667, 283.84396148068834, 1.1598250030577166], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4e6a174-956b-44e8-84d0-aca231cf33a3", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 550.1875, 146, 916, 564.5, 847.4000000000001, 916.0, 916.0, 0.09335161469121037, 0.01886518531754135, 0.06261235924326847], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 550.1875, 146, 916, 564.5, 847.4000000000001, 916.0, 916.0, 0.09366365381913548, 0.01892824449433335, 0.0628216486705615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 225.76470588235293, 140, 433, 144.0, 426.6, 433.0, 433.0, 0.083602171689354, 0.02975637958336612, 0.04726634729817452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 175.23529411764704, 139, 426, 143.0, 419.6, 426.0, 426.0, 0.08360299397074879, 0.06213074063646467, 0.04196478408297351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 252.1764705882353, 138, 1135, 144.0, 566.9999999999995, 1135.0, 1135.0, 0.08360258282802949, 1.467204197464383, 0.04880819446698436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 258.88235294117646, 139, 1572, 142.0, 651.1999999999991, 1572.0, 1572.0, 0.08360381626831907, 4.446317782101406, 0.04872727021245205], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 258.00000000000006, 142, 422, 257.5, 387.00000000000006, 422.0, 422.0, 0.09376410124178831, 0.15859318686599352, 0.06059985766902445], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 161.26666666666668, 138, 419, 143.0, 258.2000000000001, 419.0, 419.0, 0.08586000240408007, 0.0638080681928759, 0.0430976965192355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 160.1333333333333, 138, 419, 142.0, 255.2000000000001, 419.0, 419.0, 0.08572604242867593, 0.03152218018471105, 0.04841065703296452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 979.1428571428571, 708, 1127, 1113.0, 1127.0, 1127.0, 1127.0, 0.07548390575295197, 22.19477459292608, 0.04304941499973042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1504.5714285714287, 1251, 1699, 1537.0, 1699.0, 1699.0, 1699.0, 0.07485109977651601, 67.35115115310792, 0.042615421064168775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 316.2857142857143, 140, 506, 421.0, 506.0, 506.0, 506.0, 0.07574773838895381, 0.13403799019607843, 0.04194235123685235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 142.5, 140, 146, 142.0, 145.4, 146.0, 146.0, 0.06262721152340693, 0.0465422929387819, 0.03143592453421011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 211.41666666666666, 139, 424, 142.0, 424.0, 424.0, 424.0, 0.06262688467781077, 0.016757584376679836, 0.035716895167813956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 210.75000000000003, 139, 424, 142.0, 421.90000000000003, 424.0, 424.0, 0.06262721152340693, 0.01687999060591827, 0.036817950524502895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 189.16666666666666, 139, 425, 142.0, 424.1, 425.0, 425.0, 0.06262721152340693, 0.01687999060591827, 0.03687910991075622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 142.71428571428572, 140, 148, 141.0, 148.0, 148.0, 148.0, 0.07604562737642585, 0.05651437737642586, 0.04270140209125475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eef392ea-070e-4bde-be43-8115fe1f72ac", 3, 0, 0.0, 431.66666666666663, 243, 791, 261.0, 791.0, 791.0, 791.0, 0.03684191135836127, 0.030353801317712363, 0.023625835083324123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 306.6000000000001, 138, 1491, 143.0, 850.8000000000004, 1491.0, 1491.0, 0.08586295128136145, 5.172242198277589, 0.04998610093476133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1086.0625, 137, 1837, 1458.5, 1829.3, 1837.0, 1837.0, 0.08141457829792648, 45.793841829919856, 0.04349001399313064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 299.8, 135, 1110, 144.0, 699.0000000000002, 1110.0, 1110.0, 0.08586196829976131, 1.7046842891201437, 0.05006937825917721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 775.9999999999999, 141, 1276, 839.5, 1266.2, 1276.0, 1276.0, 0.08141416402918698, 14.969771016303186, 0.04356929871874459], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 482.26666666666665, 144, 1278, 486.0, 950.4000000000002, 1278.0, 1278.0, 0.09298519675667634, 0.018923940433682958, 0.06278316898199807], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7dd33b94-09dc-46a7-a17e-0f9467652ad5", 3, 0, 0.0, 427.3333333333333, 263, 660, 359.0, 660.0, 660.0, 660.0, 0.0841609156707625, 0.03808062265050777, 0.05397037886438871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 379.50000000000006, 284, 571, 287.5, 569.5, 571.0, 571.0, 0.06258018085672268, 0.09698705763634657, 0.14074429346975814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/942b81c4-0411-400a-92fd-012a445ce6c0", 3, 0, 0.0, 353.6666666666667, 257, 498, 306.0, 498.0, 498.0, 498.0, 0.01743263738370978, 0.024032297955732723, 0.011179132697235764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4c2a6fe-ef94-4641-977e-1b335404c3be", 3, 0, 0.0, 361.0, 259, 493, 331.0, 493.0, 493.0, 493.0, 0.02416217652886172, 0.024390269992187564, 0.015494624922479683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 747.5714285714286, 192, 1616, 723.0, 1317.2, 1588.9999999999995, 1616.0, 0.093821622756658, 0.05763066475970495, 0.04242130013313735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 159.93750000000003, 139, 417, 142.0, 231.50000000000017, 417.0, 417.0, 0.08141499257088193, 0.06050469662738393, 0.04086650994280597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 267.5, 139, 449, 143.5, 440.6, 449.0, 449.0, 0.08141540684805341, 0.09821130987212692, 0.04215871043084016], "isController": false}, {"data": ["login", 21, 0, 0.0, 3327.285714285714, 1853, 6136, 3297.0, 4878.0, 6020.5999999999985, 6136.0, 0.0955261900971183, 38.222634482964494, 0.19692947978028977], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 146.86666666666667, 142, 157, 146.0, 156.4, 157.0, 157.0, 0.086071852782703, 0.06968121675474687, 0.03059585391885146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d62935f-9ef0-4efa-9fe1-ab49e11b192c", 3, 0, 0.0, 801.3333333333334, 372, 1084, 948.0, 1084.0, 1084.0, 1084.0, 0.03163856107824216, 0.026375766575969458, 0.0202890512122842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b60039b-9778-497e-ab44-88defd6604ec", 3, 0, 0.0, 353.3333333333333, 291, 435, 334.0, 435.0, 435.0, 435.0, 0.022033549751755338, 0.022098101167043683, 0.014129587568671229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80e1d01d-772b-42e7-a249-58bc36f24073", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0186274-803e-48ca-bd05-73904b3a1601", 3, 0, 0.0, 352.3333333333333, 233, 518, 306.0, 518.0, 518.0, 518.0, 0.03953767281257825, 0.02541891399897202, 0.025354562317961966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1266.0000000000002, 286, 1990, 1601.5, 1978.8, 1990.0, 1990.0, 0.08135538064148717, 60.87810620245795, 0.16996044730205218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3be4d6d1-7d93-487c-878f-1d22896daf96", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9526f4ce-7ff6-4878-8641-079a0dad9039", 3, 0, 0.0, 605.3333333333334, 234, 1104, 478.0, 1104.0, 1104.0, 1104.0, 0.07352941176470587, 0.03327014399509804, 0.047152650122549024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b03de643-a25c-408c-8545-905c665643a3", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4e6a174-956b-44e8-84d0-aca231cf33a3", 3, 0, 0.0, 580.6666666666666, 422, 879, 441.0, 879.0, 879.0, 879.0, 0.03337263888579883, 0.027821395894052994, 0.02140107376465615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 521.0, 285, 1991, 298.0, 1078.999999999999, 1991.0, 1991.0, 0.08354383102523023, 6.001123080949058, 0.18663465330538712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 952.8461538461539, 141, 1843, 1392.0, 1835.0, 1843.0, 1843.0, 0.10445710428836588, 67.30282968269145, 0.15877291527725326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44614b22-c265-4c56-b1a1-a6f80c0baff4", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 1358.809523809524, 179, 3297, 1391.0, 2726.6000000000004, 3252.899999999999, 3297.0, 0.09704341075240991, 0.030326065860128096, 0.04378325758555994], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 562.6, 282, 1911, 562.0, 1109.4000000000005, 1911.0, 1911.0, 0.08565457224106622, 6.955407783573737, 0.1911781054778954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 161.7058823529412, 141, 427, 144.0, 210.19999999999982, 427.0, 427.0, 0.09366391184573003, 0.07271758780991736, 0.033294593663911846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 361.157894736842, 285, 571, 288.0, 568.0, 571.0, 571.0, 0.09667735205820994, 0.14983101339490154, 0.21742963065435303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 198.2, 141, 423, 143.0, 423.0, 423.0, 423.0, 0.036936078422681706, 0.02744956609341873, 0.018540179989510155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 198.0, 139, 425, 142.0, 425.0, 425.0, 425.0, 0.037012910103043944, 0.009903845086166055, 0.02110892529314225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 196.4, 137, 420, 142.0, 420.0, 420.0, 420.0, 0.037012910103043944, 0.009976135926211063, 0.02175954285354732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 142.2, 140, 144, 142.0, 144.0, 144.0, 144.0, 0.03701263611396931, 0.00997606207759329, 0.021795526930394035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 157.33333333333334, 144, 177, 151.0, 177.0, 177.0, 177.0, 0.07625438462711606, 0.022489086091200244, 0.04713772018453561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9526f4ce-7ff6-4878-8641-079a0dad9039", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 0.5790514823717948, 2.209785657051282], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1607.037037037037, 1100, 2714, 1468.0, 2213.5, 2405.5, 2714.0, 0.23894756870848838, 285.8643637910359, 0.4718281093052378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 1358.809523809524, 179, 3297, 1391.0, 2726.6000000000004, 3252.899999999999, 3297.0, 0.09609092947383352, 0.030028415460572975, 0.043353524821202236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 198.7, 140, 427, 142.0, 426.5, 427.0, 427.0, 0.06038866142493086, 0.016276631399688397, 0.035560901210188775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 170.2, 139, 432, 141.5, 403.2000000000001, 432.0, 432.0, 0.06038975548188005, 0.016276926282225483, 0.03550257109383964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 288.4117647058824, 138, 1515, 143.0, 642.1999999999992, 1515.0, 1515.0, 0.09284036917699742, 4.937547145499972, 0.05411066094151056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 231.58823529411768, 141, 837, 143.0, 502.5999999999997, 837.0, 837.0, 0.09284036917699742, 1.6293250129703456, 0.05420132536453497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 191.70588235294122, 140, 426, 143.0, 423.6, 426.0, 426.0, 0.09284036917699742, 0.0689956259215772, 0.046601513434547534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 170.10000000000002, 140, 422, 142.0, 394.2000000000001, 422.0, 422.0, 0.06038939079182569, 0.016158879957968983, 0.03444082443596309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 173.7058823529412, 137, 422, 141.0, 421.2, 422.0, 422.0, 0.0928408761994222, 0.033044696055355004, 0.052489654386185275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 170.2, 140, 420, 143.0, 392.5000000000001, 420.0, 420.0, 0.06038866142493086, 0.04487868295348865, 0.030312277316810996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 257.2, 142, 431, 146.0, 430.7, 431.0, 431.0, 0.0598831081728466, 0.047134555846986684, 0.021286573608316567], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 547.6, 141, 1084, 493.0, 1031.8, 1084.0, 1084.0, 0.09256573710096454, 0.018332354964917585, 0.06298809141792196], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1583.142857142857, 876, 3169, 1471.0, 2091.2, 3062.1999999999985, 3169.0, 0.09460098655314549, 0.04896340124332725, 0.043512758463409684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 370.8, 283, 852, 286.5, 823.7, 852.0, 852.0, 0.06033655731671262, 0.09350987935705365, 0.13569833154334882], "isController": false}, {"data": ["addBook", 57, 17, 29.82456140350877, 1373.40350877193, 715, 2749, 1129.0, 2528.6, 2577.9, 2749.0, 0.2870929072941745, 79.48751574761259, 1.0440515656007292], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 251.92592592592607, 141, 794, 144.0, 574.0, 597.25, 794.0, 0.23999360017066212, 0.17835461887682996, 0.1160125313324978], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 887.6111111111112, 695, 1392, 840.0, 1149.0, 1273.75, 1392.0, 0.24012593271137753, 70.60499714850455, 0.12076646029917912], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 217.24074074074076, 140, 431, 145.0, 427.0, 428.5, 431.0, 0.24042528561633467, 0.4254400561882797, 0.11692557835638151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38c72bb2-7a67-4210-b198-5808d521b8ff", 2, 0, 0.0, 284.0, 267, 301, 284.0, 301.0, 301.0, 301.0, 0.024449279968704923, 0.034847386830395344, 0.01519723310554754], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1352.9814814814818, 955, 1884, 1322.5, 1685.0, 1836.25, 1884.0, 0.2398283894635394, 215.7980064126336, 0.12038260955494069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 167.57894736842107, 141, 436, 146.0, 194.0, 436.0, 436.0, 0.09661147947768783, 0.07217556816448359, 0.03434236184558435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7dd33b94-09dc-46a7-a17e-0f9467652ad5", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 0.719777141434263, 2.746825199203187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 17, 10.119047619047619, 219.89285714285717, 140, 2158, 148.0, 362.59999999999997, 427.09999999999997, 2062.78, 0.6973934918243067, 1.5239064504227948, 0.3337704366388955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 146.6, 143, 153, 146.0, 153.0, 153.0, 153.0, 0.03574594640967714, 0.027682163577025364, 0.012706566887814921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eef392ea-070e-4bde-be43-8115fe1f72ac", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 148.47058823529414, 144, 182, 145.0, 161.2, 182.0, 182.0, 0.08331454671985729, 0.06761170734785293, 0.02961571777932427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80e1d01d-772b-42e7-a249-58bc36f24073", 3, 0, 0.0, 532.3333333333334, 234, 997, 366.0, 997.0, 997.0, 997.0, 0.036031707902954596, 0.030038152324045157, 0.023106271018496275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d62935f-9ef0-4efa-9fe1-ab49e11b192c", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4c2a6fe-ef94-4641-977e-1b335404c3be", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.24680882855191258, 0.9418758538251366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 398.6, 285, 850, 286.0, 850.0, 850.0, 850.0, 0.03689655681331818, 0.05718245670189057, 0.0829812210362029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0186274-803e-48ca-bd05-73904b3a1601", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 497.76470588235304, 282, 1657, 288.0, 1010.5999999999995, 1657.0, 1657.0, 0.09276741571807437, 6.6636719048424595, 0.2072398914211968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=942b81c4-0411-400a-92fd-012a445ce6c0", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44614b22-c265-4c56-b1a1-a6f80c0baff4", 3, 0, 0.0, 333.0, 251, 492, 256.0, 492.0, 492.0, 492.0, 0.025001041710071253, 0.025074286949456227, 0.016032569065377724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b03de643-a25c-408c-8545-905c665643a3", 3, 0, 0.0, 1553.3333333333335, 247, 3950, 463.0, 3950.0, 3950.0, 3950.0, 0.04333944901113824, 0.027863089777668625, 0.027792550309877057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 147.0, 144, 157, 145.5, 155.8, 157.0, 157.0, 0.06438493607112389, 0.05338165109803143, 0.02288683274403232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 147.1875, 141, 168, 145.0, 158.9, 168.0, 168.0, 0.08482978373707009, 0.06585906061618234, 0.030154337187786633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 143.3157894736842, 140, 146, 143.0, 146.0, 146.0, 146.0, 0.09674774806886403, 0.07189944949258352, 0.04856283447987902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b60039b-9778-497e-ab44-88defd6604ec", 1, 0, 0.0, 1278.0, 1278, 1278, 1278.0, 1278.0, 1278.0, 1278.0, 0.7824726134585289, 0.14136468114241002, 0.5394781885758998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 156.8421052631579, 140, 421, 142.0, 145.0, 421.0, 421.0, 0.09674971866200231, 0.025888108313856087, 0.05517757392442319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 201.21052631578945, 139, 427, 142.0, 424.0, 427.0, 427.0, 0.09675119665953763, 0.026077470974641002, 0.056879121473673494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 170.94736842105266, 137, 422, 142.0, 416.0, 422.0, 422.0, 0.09674971866200231, 0.02607707260811781, 0.05697273471990956], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 19.444444444444443, 0.5477308294209703], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.333333333333334, 0.2347417840375587], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.2347417840375587], "isController": false}, {"data": ["401/Unauthorized", 23, 63.888888888888886, 1.7996870109546166], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1278, 36, "401/Unauthorized", 23, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
