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

    var data = {"OkPercent": 98.0347694633409, "KoPercent": 1.965230536659108};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8076171875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42a4b8a3-c6b5-4389-9ef5-f0762448c001"], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "see books"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac027319-c40c-40db-aee7-c8d326788298"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/33e8e905-f5ca-44d6-9ec2-ad4e1098e3bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e6ae336-7478-44bb-8d77-edd84e1c208b"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7866a0af-65b3-46c4-aa11-c705606d1d4b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d6a0a08-3e69-4393-ab76-3d901ff74168"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15c0d1d6-d3b8-4727-bf54-e24b9ddffd10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c59d5ef5-7ee7-4ef2-8264-2dc7add9c74e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6abe46e-37f3-46f8-8984-b9ad839bf367"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/54cd094c-17cd-4b42-985b-3ac6581d1ac2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4f89b66-be23-4ef2-92a3-904687c1c4a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e6ae336-7478-44bb-8d77-edd84e1c208b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7866a0af-65b3-46c4-aa11-c705606d1d4b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0a1759f-ecf7-47f4-a901-70c205bb3ae3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/962fd806-6b4c-4425-90a8-a28670366820"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4a65aad0-7d9a-460b-9a32-5aeaa9d86ca1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac027319-c40c-40db-aee7-c8d326788298"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0a1759f-ecf7-47f4-a901-70c205bb3ae3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.31451612903225806, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42a4b8a3-c6b5-4389-9ef5-f0762448c001"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d6a0a08-3e69-4393-ab76-3d901ff74168"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9055555555555556, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54cd094c-17cd-4b42-985b-3ac6581d1ac2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b4f89b66-be23-4ef2-92a3-904687c1c4a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15c0d1d6-d3b8-4727-bf54-e24b9ddffd10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/041f8a27-baaf-4d3c-b65e-b2171cdf669a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c59d5ef5-7ee7-4ef2-8264-2dc7add9c74e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a65aad0-7d9a-460b-9a32-5aeaa9d86ca1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=962fd806-6b4c-4425-90a8-a28670366820"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 26, 1.965230536659108, 300.9108087679516, 77, 2463, 92.0, 856.2000000000003, 1026.6, 1653.4399999999998, 5.155502905084971, 711.9663766493322, 3.7722280525798944], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42a4b8a3-c6b5-4389-9ef5-f0762448c001", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1329.303571428571, 1029, 1674, 1277.0, 1596.3, 1622.25, 1674.0, 0.2511154458420215, 302.17659952971906, 1.234732685365799], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 573.769230769231, 85, 1133, 508.0, 1039.8, 1133.0, 1133.0, 0.07415520113172246, 0.014048934589408356, 0.05012940617370571], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 573.769230769231, 85, 1133, 508.0, 1039.8, 1133.0, 1133.0, 0.07534484757157761, 0.01427431682508404, 0.05093361503129709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 112.75000000000001, 79, 241, 80.0, 237.0, 240.8, 241.0, 0.10502381414985848, 0.03598911756365756, 0.059455376037766565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 99.15, 79, 237, 81.0, 222.50000000000028, 236.95, 237.0, 0.10502215967569158, 0.07804869483711063, 0.052716201243462366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 131.7, 78, 615, 81.0, 239.5, 596.2499999999998, 615.0, 0.10502381414985848, 1.5709162638565795, 0.061393803857524694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac027319-c40c-40db-aee7-c8d326788298", 3, 0, 0.0, 387.6666666666667, 222, 556, 385.0, 556.0, 556.0, 556.0, 0.03897774370834254, 0.03249414115789884, 0.024995493198383723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 131.19999999999996, 77, 785, 80.0, 235.5, 757.5499999999996, 785.0, 0.10502436565283146, 4.751947422505147, 0.06129156339270711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33e8e905-f5ca-44d6-9ec2-ad4e1098e3bd", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.6048029119318181, 1.130075165719697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e6ae336-7478-44bb-8d77-edd84e1c208b", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 251.92307692307693, 79, 532, 222.0, 469.5999999999999, 532.0, 532.0, 0.07411250277921885, 0.14934960934159594, 0.047907007693447884], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7866a0af-65b3-46c4-aa11-c705606d1d4b", 3, 0, 0.0, 347.3333333333333, 223, 443, 376.0, 443.0, 443.0, 443.0, 0.01819913493445278, 0.025088976708140476, 0.011670669212523433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d6a0a08-3e69-4393-ab76-3d901ff74168", 1, 0, 0.0, 752.0, 752, 752, 752.0, 752.0, 752.0, 752.0, 1.3297872340425532, 0.24024476396276595, 0.9168259640957447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 79.86666666666666, 78, 82, 80.0, 81.4, 82.0, 82.0, 0.07813151095924661, 0.05806453109373697, 0.039218356086965576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 92.26666666666665, 78, 253, 79.0, 159.40000000000006, 253.0, 253.0, 0.07813395284876393, 0.020906936602110657, 0.04456076998406067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 558.4, 466, 622, 616.0, 622.0, 622.0, 622.0, 0.03810162465327522, 11.203142741068978, 0.02172983281007102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 755.6, 543, 902, 785.0, 902.0, 902.0, 902.0, 0.03798843631998419, 34.18206177727, 0.021628182006397254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 207.6, 82, 247, 237.0, 247.0, 247.0, 247.0, 0.03816793893129771, 0.0675393606870229, 0.021134005248091604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 91.53333333333335, 80, 237, 81.0, 145.20000000000005, 237.0, 237.0, 0.07963643313725073, 0.05918293517328888, 0.03997375647709656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 90.93333333333332, 77, 232, 80.0, 143.80000000000007, 232.0, 232.0, 0.07963685593692761, 0.029283135568474426, 0.044972010963340504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 166.0, 77, 854, 81.0, 507.8000000000002, 854.0, 854.0, 0.07963770154974967, 4.7972434488035764, 0.046362000472517026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 126.66666666666669, 78, 616, 81.0, 388.0000000000001, 616.0, 616.0, 0.07963643313725073, 1.5810839082641381, 0.04643903200588248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15c0d1d6-d3b8-4727-bf54-e24b9ddffd10", 3, 0, 0.0, 395.6666666666667, 184, 555, 448.0, 555.0, 555.0, 555.0, 0.09838968876061789, 0.04567177609786494, 0.06309495014922437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 143.4, 80, 239, 82.0, 239.0, 239.0, 239.0, 0.03821402913437581, 0.028399293135996085, 0.021458073000259852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 542.6666666666667, 78, 1012, 798.5, 969.7, 1012.0, 1012.0, 0.08604782346810973, 43.02474270804451, 0.04647852270228409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 111.66666666666666, 78, 236, 79.0, 236.0, 236.0, 236.0, 0.07806970062872133, 0.021042223997585045, 0.04589644509618187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 393.6111111111112, 78, 781, 467.5, 713.5000000000001, 781.0, 781.0, 0.08604905752379496, 14.066574632020767, 0.046563221557201113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 133.60000000000002, 79, 237, 83.0, 236.4, 237.0, 237.0, 0.07807091962338589, 0.021042552554740725, 0.0459734028641618], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 459.38461538461536, 83, 752, 487.0, 741.2, 752.0, 752.0, 0.07535052484538651, 0.01427539240234862, 0.0515374495731103], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 269.6666666666667, 161, 936, 166.0, 658.8000000000002, 936.0, 936.0, 0.0796017788344177, 6.463902832098622, 0.17766847550653267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 716.0500000000001, 161, 2463, 563.0, 1475.8000000000009, 2415.7999999999993, 2463.0, 0.09350775646839905, 0.05743786994006153, 0.04227938598131715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 82.77777777777779, 80, 103, 81.0, 89.50000000000003, 103.0, 103.0, 0.08604617811558869, 0.06394642729097949, 0.04319114799942636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c59d5ef5-7ee7-4ef2-8264-2dc7add9c74e", 3, 0, 0.0, 299.3333333333333, 177, 527, 194.0, 527.0, 527.0, 527.0, 0.054242681758186126, 0.0348728178621151, 0.034784532247274305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 121.0, 78, 324, 81.0, 252.90000000000012, 324.0, 324.0, 0.0860482348160719, 0.09482485598871812, 0.04505954657360709], "isController": false}, {"data": ["login", 20, 0, 0.0, 2918.900000000001, 1468, 5066, 2827.0, 4146.5, 5020.15, 5066.0, 0.09379983116030391, 28.18293330392318, 0.18040895260763531], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 95.53333333333335, 81, 244, 83.0, 158.80000000000007, 244.0, 244.0, 0.0800102413108878, 0.06477391606125583, 0.028441140465979644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6abe46e-37f3-46f8-8984-b9ad839bf367", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54cd094c-17cd-4b42-985b-3ac6581d1ac2", 3, 0, 0.0, 731.3333333333333, 231, 1730, 233.0, 1730.0, 1730.0, 1730.0, 0.07458790184232118, 0.03374908319037319, 0.0478314344496656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4f89b66-be23-4ef2-92a3-904687c1c4a1", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e6ae336-7478-44bb-8d77-edd84e1c208b", 3, 0, 0.0, 351.0, 273, 478, 302.0, 478.0, 478.0, 478.0, 0.0656225391547817, 0.04218896967144982, 0.04208216215329425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7866a0af-65b3-46c4-aa11-c705606d1d4b", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0a1759f-ecf7-47f4-a901-70c205bb3ae3", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 635.7777777777777, 161, 1116, 880.0, 1057.5, 1116.0, 1116.0, 0.08601287326003125, 57.22663436405427, 0.18121874566949076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/962fd806-6b4c-4425-90a8-a28670366820", 3, 0, 0.0, 573.3333333333334, 190, 1115, 415.0, 1115.0, 1115.0, 1115.0, 0.03185660281187614, 0.026557538997791275, 0.020428876152147137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a65aad0-7d9a-460b-9a32-5aeaa9d86ca1", 3, 0, 0.0, 687.6666666666666, 288, 1227, 548.0, 1227.0, 1227.0, 1227.0, 0.017305029995385322, 0.02385638086928934, 0.011097301136363636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 264.0, 160, 865, 176.0, 477.5, 845.6499999999997, 865.0, 0.10497805958554662, 6.434073491530896, 0.23475513539545237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 675.5714285714286, 79, 1137, 867.0, 1137.0, 1137.0, 1137.0, 0.05058205493211166, 43.227954804933916, 0.09104487621848556], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1037.6521739130435, 159, 1639, 1078.0, 1559.0000000000002, 1630.1999999999998, 1639.0, 0.09591646093280844, 0.029925023562087143, 0.04327480952241943], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 226.4, 160, 334, 168.0, 324.4, 334.0, 334.0, 0.07803558422640723, 0.120939914225887, 0.1755038578841952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 94.3529411764706, 79, 235, 84.0, 125.3999999999999, 235.0, 235.0, 0.09992417518471278, 0.07757785085141275, 0.03551992164769087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 388.87499999999994, 160, 1013, 322.5, 972.4000000000001, 1013.0, 1013.0, 0.08998318439241666, 20.29790299636974, 0.198057470432088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 81.33333333333333, 79, 84, 81.0, 83.7, 84.0, 84.0, 0.05362074050242634, 0.039849007346041444, 0.02691509826000697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 79.83333333333333, 77, 82, 80.0, 82.0, 82.0, 82.0, 0.0536216989141606, 0.014347993654765629, 0.030581125161982217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 80.25, 78, 84, 80.0, 83.4, 84.0, 84.0, 0.05362217813287576, 0.014452852699876667, 0.03152397581639766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac027319-c40c-40db-aee7-c8d326788298", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 93.49999999999999, 78, 234, 81.0, 189.00000000000017, 234.0, 234.0, 0.0536216989141606, 0.01445272353545735, 0.03157605902855356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 3.5532756024096384, 7.447759789156626], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 924.8749999999998, 617, 1318, 894.5, 1257.4, 1294.4, 1318.0, 0.24467717904689498, 292.7189696906145, 0.4831418515945525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1037.6521739130435, 159, 1639, 1078.0, 1559.0000000000002, 1630.1999999999998, 1639.0, 0.09137499503396766, 0.02850812939493862, 0.04122582783759088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 111.0, 78, 233, 80.0, 233.0, 233.0, 233.0, 0.029592978178137892, 0.007976232399576228, 0.017426333829508932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 80.8, 78, 87, 80.0, 87.0, 87.0, 87.0, 0.029592978178137892, 0.007976232399576228, 0.017397434436756846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 89.6470588235294, 78, 235, 80.0, 114.99999999999989, 235.0, 235.0, 0.09377551245559454, 0.025275431091546965, 0.05512974462721476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 107.88235294117646, 78, 238, 80.0, 237.2, 238.0, 238.0, 0.09377551245559454, 0.025275431091546965, 0.055221322276097176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 90.94117647058823, 80, 238, 81.0, 119.5999999999999, 238.0, 238.0, 0.09377551245559454, 0.06969059079951899, 0.0470709115255621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 80.6, 78, 88, 79.0, 88.0, 88.0, 88.0, 0.029592978178137892, 0.007918433614072053, 0.016877245367219264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0a1759f-ecf7-47f4-a901-70c205bb3ae3", 3, 0, 0.0, 335.3333333333333, 170, 440, 396.0, 440.0, 440.0, 440.0, 0.03760718046432332, 0.030788430621019904, 0.024116583826405254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 107.76470588235296, 77, 239, 80.0, 238.2, 239.0, 239.0, 0.09377602974355015, 0.02509241420872338, 0.05348164196311844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 80.8, 78, 83, 81.0, 83.0, 83.0, 83.0, 0.0295922775992377, 0.02199191723927724, 0.014853936216804864], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 634.1538461538462, 80, 1730, 527.0, 1498.7999999999997, 1730.0, 1730.0, 0.07505687001304835, 0.014061886554427779, 0.05108287577510652], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 92.2, 80, 107, 85.0, 107.0, 107.0, 107.0, 0.030565149616407373, 0.024058115811351897, 0.010864955527707307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1659.65, 972, 2404, 1626.0, 2327.6000000000004, 2400.85, 2404.0, 0.09324661398232977, 0.04826240762757302, 0.04288979998601301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 193.6, 159, 312, 165.0, 312.0, 312.0, 312.0, 0.029578272983797022, 0.04584054611844324, 0.06652222918133256], "isController": false}, {"data": ["addBook", 62, 14, 22.580645161290324, 873.8548387096773, 409, 2502, 697.0, 1570.2, 1641.5499999999997, 2502.0, 0.2860438292964244, 83.89968101211073, 1.0403690888119954], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/42a4b8a3-c6b5-4389-9ef5-f0762448c001", 3, 0, 0.0, 445.0, 193, 941, 201.0, 941.0, 941.0, 941.0, 0.021220609455903573, 0.025082041970828733, 0.01360826843363608], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 145.10714285714283, 78, 328, 81.0, 322.3, 325.15, 328.0, 0.24551496764463462, 0.1824579007593427, 0.11868155174227943], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 507.375, 386, 717, 470.0, 633.3, 690.25, 717.0, 0.2452440177977087, 72.10988410030481, 0.12334049723224609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d6a0a08-3e69-4393-ab76-3d901ff74168", 3, 0, 0.0, 346.3333333333333, 300, 379, 360.0, 379.0, 379.0, 379.0, 0.02528061482455253, 0.029880830868473388, 0.0162118526055887], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 120.17857142857144, 77, 244, 82.0, 238.3, 239.15, 244.0, 0.24581672607237545, 0.4349803785577581, 0.11954758748441698], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 778.2857142857142, 534, 1074, 773.5, 959.3000000000001, 997.05, 1074.0, 0.24506478900359285, 220.50972792338226, 0.12301103666781905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 88.4375, 80, 108, 85.0, 105.9, 108.0, 108.0, 0.09073844077331837, 0.0677879953042857, 0.032254680118640515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 14, 7.777777777777778, 155.83888888888882, 80, 1927, 88.0, 308.70000000000005, 364.29999999999984, 1272.5199999999982, 0.7244918494666934, 1.5241292890923728, 0.34929060173073057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 104.5, 79, 301, 85.0, 239.50000000000023, 301.0, 301.0, 0.05272616228233981, 0.04083188153310104, 0.018742502998800478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54cd094c-17cd-4b42-985b-3ac6581d1ac2", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 118.00000000000001, 81, 339, 86.0, 315.20000000000016, 338.25, 339.0, 0.10048534421254661, 0.08154621195373656, 0.035719399700553676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4f89b66-be23-4ef2-92a3-904687c1c4a1", 3, 0, 0.0, 628.3333333333333, 201, 1152, 532.0, 1152.0, 1152.0, 1152.0, 0.03436071882623784, 0.028645117485024456, 0.022034705757711118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15c0d1d6-d3b8-4727-bf54-e24b9ddffd10", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 0.6273057725694445, 2.393934461805556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 176.41666666666666, 158, 318, 164.0, 273.60000000000014, 318.0, 318.0, 0.053601100609265845, 0.0830712369793993, 0.1205501315460344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 218.94117647058826, 159, 477, 166.0, 356.9999999999999, 477.0, 477.0, 0.09373363107545557, 0.1452688208171367, 0.2108091331706779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/041f8a27-baaf-4d3c-b65e-b2171cdf669a", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.9256114130434784, 1.7295063405797102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c59d5ef5-7ee7-4ef2-8264-2dc7add9c74e", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 99.2, 81, 241, 83.0, 168.40000000000003, 241.0, 241.0, 0.08513246611727848, 0.0705834606773139, 0.030261931315126337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a65aad0-7d9a-460b-9a32-5aeaa9d86ca1", 1, 0, 0.0, 725.0, 725, 725, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 0.2491918103448276, 0.950969827586207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 87.05555555555554, 80, 118, 84.0, 99.10000000000002, 118.0, 118.0, 0.08266170696424881, 0.06417583694978302, 0.02938365364744782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=962fd806-6b4c-4425-90a8-a28670366820", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 91.74999999999999, 78, 253, 80.0, 140.30000000000013, 253.0, 253.0, 0.09002419400213807, 0.06690274573791707, 0.045187925504979465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 99.875, 77, 241, 80.0, 238.9, 241.0, 241.0, 0.09002419400213807, 0.04944077744331289, 0.04992430582906657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 290.875, 78, 933, 237.5, 884.0, 933.0, 933.0, 0.0900236874827689, 15.207865705405922, 0.051473504903477726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 216.68749999999997, 79, 619, 82.5, 614.1, 619.0, 619.0, 0.09002419400213807, 4.982858918725032, 0.051561708771732405], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 30.76923076923077, 0.6046863189720333], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 3.8461538461538463, 0.07558578987150416], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.8461538461538463, 0.07558578987150416], "isController": false}, {"data": ["401/Unauthorized", 16, 61.53846153846154, 1.2093726379440666], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 26, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
