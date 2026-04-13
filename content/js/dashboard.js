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

    var data = {"OkPercent": 97.56295694557271, "KoPercent": 2.4370430544272947};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6578397212543554, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/75d8e6fd-b440-4fb8-af0a-a8eee9bf1408"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bddd5728-e766-4ab5-a5b8-ba9ce5e97a68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91f545d8-4fc5-4558-9933-a8c102b3b3e4"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8570ba31-6973-4a16-b874-0e40dfd38de1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd7ef707-af76-4e08-8d7e-bd9b0f5607f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abaf3976-720e-48a8-931f-8cd85d3a4880"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ca47dff-f357-48b6-b694-efd8e8523417"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=554b20f8-c6c6-4fa4-b9eb-29ba409e969b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/abaf3976-720e-48a8-931f-8cd85d3a4880"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/378a3d72-a328-4dff-9480-2ec998596ade"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b9412d5-6a2f-47d3-85d8-dd33334d7c8e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07a74746-5d16-432f-8682-c9257a6167c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91f545d8-4fc5-4558-9933-a8c102b3b3e4"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c554bb8-1ce6-4a34-97cf-3afe015d3ef8"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "register"], "isController": true}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/50227078-e1ac-49d1-a2c2-004b78623923"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.11320754716981132, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c809f59d-1deb-4ffc-a144-5b0c14a4b2e6"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bddd5728-e766-4ab5-a5b8-ba9ce5e97a68"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97caeab5-6fb4-47ff-96d6-b621c24047be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/07a74746-5d16-432f-8682-c9257a6167c9"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.12962962962962962, 500, 1500, "addBook"], "isController": true}, {"data": [0.8773584905660378, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.4716981132075472, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8570ba31-6973-4a16-b874-0e40dfd38de1"], "isController": false}, {"data": [0.9245283018867925, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.25471698113207547, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.84472049689441, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5b9412d5-6a2f-47d3-85d8-dd33334d7c8e"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/8ca47dff-f357-48b6-b694-efd8e8523417"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/cd7ef707-af76-4e08-8d7e-bd9b0f5607f2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/554b20f8-c6c6-4fa4-b9eb-29ba409e969b"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=378a3d72-a328-4dff-9480-2ec998596ade"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c554bb8-1ce6-4a34-97cf-3afe015d3ef8"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1231, 30, 2.4370430544272947, 605.4256701868399, 139, 3757, 348.0, 1559.3999999999996, 1885.799999999999, 2590.760000000002, 4.895196662835874, 697.7450734565317, 3.5771434939317057], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2959.584905660378, 2010, 3941, 3020.0, 3569.2000000000003, 3728.4999999999995, 3941.0, 0.25821790668102296, 310.7218353309696, 1.269655429823194], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/75d8e6fd-b440-4fb8-af0a-a8eee9bf1408", 1, 0, 0.0, 849.0, 849, 849, 849.0, 849.0, 849.0, 849.0, 1.1778563015312131, 0.37613184628975266, 0.7028029299175501], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 824.4999999999998, 153, 1855, 903.0, 1684.0, 1855.0, 1855.0, 0.08042556613853878, 0.01649913434803589, 0.053839575769500325], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 824.4999999999998, 153, 1855, 903.0, 1684.0, 1855.0, 1855.0, 0.07974072871634513, 0.016358641403095082, 0.053381122592826756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 328.9285714285714, 140, 694, 286.5, 668.0, 694.0, 694.0, 0.0856049210600335, 0.032089902746695036, 0.0483080225568967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 268.5, 140, 615, 241.5, 522.5, 615.0, 615.0, 0.0858927322478128, 0.06383239183650932, 0.04311412536657791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 431.57142857142856, 144, 1165, 437.5, 944.5, 1165.0, 1165.0, 0.08573073201797896, 1.8220052992308728, 0.04995776613268668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 408.3571428571429, 142, 1459, 282.0, 1086.5, 1459.0, 1459.0, 0.0856012571156045, 5.523150028813994, 0.04979872240123755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bddd5728-e766-4ab5-a5b8-ba9ce5e97a68", 3, 0, 0.0, 541.6666666666666, 242, 952, 431.0, 952.0, 952.0, 952.0, 0.022460974057574964, 0.022526777692509267, 0.014403684535619361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91f545d8-4fc5-4558-9933-a8c102b3b3e4", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 463.8571428571429, 149, 983, 386.5, 963.0, 983.0, 983.0, 0.07974299970381171, 0.134443938535235, 0.05153591603346928], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 178.23529411764707, 143, 432, 149.0, 297.5999999999999, 432.0, 432.0, 0.08292804284940755, 0.06162914121913979, 0.04162599025839402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 239.7058823529412, 141, 516, 146.0, 455.99999999999994, 516.0, 516.0, 0.08289730973848337, 0.02950549926123868, 0.04686783791625421], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1177.5, 1072, 1392, 1108.5, 1392.0, 1392.0, 1392.0, 0.029604045886271125, 8.704572437399777, 0.016883557419514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1732.0, 1398, 1891, 1775.0, 1891.0, 1891.0, 1891.0, 0.029512163930233242, 26.55509698127453, 0.01680233551887303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8570ba31-6973-4a16-b874-0e40dfd38de1", 3, 0, 0.0, 380.0, 302, 523, 315.0, 523.0, 523.0, 523.0, 0.07738540511259577, 0.035014880568524774, 0.04962540627337684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 368.5, 152, 613, 362.0, 613.0, 613.0, 613.0, 0.02974154596555929, 0.05262859500936859, 0.016468219299289176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd7ef707-af76-4e08-8d7e-bd9b0f5607f2", 1, 0, 0.0, 1061.0, 1061, 1061, 1061.0, 1061.0, 1061.0, 1061.0, 0.942507068803016, 0.1702771559849199, 0.6498144439208294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 248.25, 144, 394, 263.5, 394.0, 394.0, 394.0, 0.053385295020486605, 0.03967403272518585, 0.02679691566458019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 226.375, 140, 430, 214.0, 430.0, 430.0, 430.0, 0.05338600752742706, 0.024307837900061392, 0.029886258608493713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 375.75, 145, 1622, 216.5, 1622.0, 1622.0, 1622.0, 0.05338707632349899, 6.017313939782715, 0.03081226768280069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 359.875, 144, 1195, 238.5, 1195.0, 1195.0, 1195.0, 0.053388145162366694, 1.974826968187339, 0.030865021421993245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 356.8333333333333, 146, 677, 310.5, 677.0, 677.0, 677.0, 0.029742283116792986, 0.02210339594910104, 0.016700989054839813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abaf3976-720e-48a8-931f-8cd85d3a4880", 1, 0, 0.0, 880.0, 880, 880, 880.0, 880.0, 880.0, 880.0, 1.1363636363636362, 0.20530007102272727, 0.7834694602272727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 1282.25, 144, 1877, 1596.0, 1851.5, 1877.0, 1877.0, 0.0657418973111564, 44.370435945820454, 0.03441177437380843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 246.52941176470586, 142, 1772, 147.0, 531.1999999999989, 1772.0, 1772.0, 0.08289811821271657, 4.408786507173126, 0.04831596434893281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 866.25, 144, 1158, 1123.0, 1155.0, 1158.0, 1158.0, 0.06574153714670772, 14.502075908876751, 0.034475786570099656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 266.2352941176471, 142, 953, 148.0, 548.9999999999997, 953.0, 953.0, 0.08289771397362877, 1.454833927230436, 0.048396683542853244], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 730.6153846153846, 153, 1092, 880.0, 1079.6, 1092.0, 1092.0, 0.08058217522284071, 0.01597478668968424, 0.05467384364578556], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 663.125, 293, 1926, 555.0, 1926.0, 1926.0, 1926.0, 0.05333191114903602, 8.047760653465907, 0.1182390344590811], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ca47dff-f357-48b6-b694-efd8e8523417", 1, 0, 0.0, 957.0, 957, 957, 957.0, 957.0, 957.0, 957.0, 1.0449320794148382, 0.18878167450365727, 0.7204316875653083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 710.2857142857144, 179, 1683, 623.0, 1569.6000000000001, 1676.6999999999998, 1683.0, 0.0933316741035715, 0.057329709971822726, 0.042199770615189064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 162.41666666666666, 143, 295, 149.0, 254.50000000000014, 295.0, 295.0, 0.06577108374303237, 0.04887870578949965, 0.0330140010194518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 227.66666666666666, 146, 445, 150.0, 439.6, 445.0, 445.0, 0.0657397363836571, 0.09164401727311573, 0.033351360401669784], "isController": false}, {"data": ["login", 21, 0, 0.0, 3593.142857142858, 1303, 6653, 3251.0, 5917.200000000001, 6587.399999999999, 6653.0, 0.09324713154062023, 31.999949074855245, 0.18486816215454158], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=554b20f8-c6c6-4fa4-b9eb-29ba409e969b", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abaf3976-720e-48a8-931f-8cd85d3a4880", 3, 0, 0.0, 603.3333333333334, 234, 1019, 557.0, 1019.0, 1019.0, 1019.0, 0.02797046319087044, 0.02331782429421198, 0.0179367879186246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/378a3d72-a328-4dff-9480-2ec998596ade", 3, 0, 0.0, 623.0, 224, 1303, 342.0, 1303.0, 1303.0, 1303.0, 0.035670546829482896, 0.029737067197365137, 0.02287466707489626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 180.35294117647058, 143, 446, 154.0, 281.9999999999999, 446.0, 446.0, 0.08373105584861426, 0.0677861770493176, 0.029763773758687096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b9412d5-6a2f-47d3-85d8-dd33334d7c8e", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 0.19616076275787186, 0.7485918838219326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07a74746-5d16-432f-8682-c9257a6167c9", 1, 0, 0.0, 1028.0, 1028, 1028, 1028.0, 1028.0, 1028.0, 1028.0, 0.9727626459143969, 0.17574325145914396, 0.6706742461089494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91f545d8-4fc5-4558-9933-a8c102b3b3e4", 3, 0, 0.0, 350.0, 237, 479, 334.0, 479.0, 479.0, 479.0, 0.0471342383107089, 0.030302773653531925, 0.030226057770864755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1447.0833333333335, 292, 2035, 1749.5, 2006.8000000000002, 2035.0, 2035.0, 0.06568144499178982, 58.9588304341133, 0.13511519909688013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 1224.272727272727, 149, 2569, 1545.0, 2504.6000000000004, 2569.0, 2569.0, 0.05406654116675596, 35.28787399608263, 0.08269819227290824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 763.5, 285, 1702, 719.0, 1431.5, 1702.0, 1702.0, 0.0855243866679699, 7.431428484431508, 0.19078333465692504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c554bb8-1ce6-4a34-97cf-3afe015d3ef8", 3, 0, 0.0, 595.3333333333334, 409, 861, 516.0, 861.0, 861.0, 861.0, 0.020521099110068337, 0.024255244423391317, 0.013159689207953977], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1338.681818181818, 192, 3354, 1239.0, 2165.2, 3184.9499999999975, 3354.0, 0.09378143809572527, 0.029356654006172524, 0.0423115472658448], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 546.0588235294117, 297, 2008, 488.0, 1104.7999999999993, 2008.0, 2008.0, 0.08283752637400656, 5.9503877831703385, 0.18505678786527693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 245.15000000000003, 150, 438, 232.0, 395.0, 435.84999999999997, 438.0, 0.1090982484276215, 0.0847003002929288, 0.038781017995756076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 819.0555555555554, 303, 2063, 726.0, 1826.3000000000004, 2063.0, 2063.0, 0.09407239393337584, 12.634404299631026, 0.20889665167605648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50227078-e1ac-49d1-a2c2-004b78623923", 1, 0, 0.0, 1029.0, 1029, 1029, 1029.0, 1029.0, 1029.0, 1029.0, 0.9718172983479105, 0.31033618804664725, 0.5798636418853256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 270.72727272727275, 146, 394, 242.0, 387.20000000000005, 394.0, 394.0, 0.06778491231097253, 0.05037531080922861, 0.03402484856234363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 332.1818181818182, 151, 656, 280.0, 640.8000000000001, 656.0, 656.0, 0.06768814226816812, 0.01811186619284967, 0.03860339363731463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 269.54545454545456, 146, 378, 275.0, 368.6, 378.0, 378.0, 0.06768855878751331, 0.018244181860696946, 0.039793469130940444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 331.81818181818187, 146, 643, 282.0, 629.6, 643.0, 643.0, 0.06768522677627571, 0.018243283779543065, 0.03985760912704517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 265.5, 153, 378, 265.5, 378.0, 378.0, 378.0, 0.026921886147343484, 0.007939853141111066, 0.01664214251100432], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1891.433962264151, 1159, 2663, 1897.0, 2426.0, 2533.5999999999995, 2663.0, 0.2500636954696008, 299.1631159882706, 0.4937781174214187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c809f59d-1deb-4ffc-a144-5b0c14a4b2e6", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.7943680037313432, 1.48427782960199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1338.681818181818, 192, 3354, 1239.0, 2165.2, 3184.9499999999975, 3354.0, 0.09628514407758833, 0.030140395775708134, 0.043441148988130666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 187.00000000000003, 142, 269, 167.0, 269.0, 269.0, 269.0, 0.050501771169260294, 0.013611805510464687, 0.029738835952210895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 179.57142857142858, 139, 259, 147.0, 259.0, 259.0, 259.0, 0.05050249987374375, 0.013612001919094995, 0.029689946214837636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bddd5728-e766-4ab5-a5b8-ba9ce5e97a68", 1, 0, 0.0, 931.0, 931, 931, 931.0, 931.0, 931.0, 931.0, 1.0741138560687433, 0.19405377282491942, 0.7405511546723952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 323.8, 143, 707, 247.5, 650.9000000000002, 704.6999999999999, 707.0, 0.10704918910239256, 0.02885310175025424, 0.06293321468714874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 304.20000000000005, 142, 714, 247.0, 570.3000000000002, 707.1499999999999, 714.0, 0.10705090805932761, 0.028853565062865644, 0.06303876714821734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 187.14285714285714, 145, 271, 169.0, 271.0, 271.0, 271.0, 0.05050213551887337, 0.013513266730636037, 0.028801999163107467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 254.10000000000002, 145, 414, 246.5, 403.70000000000005, 413.65, 414.0, 0.10704918910239256, 0.07955511026066477, 0.053733674998661884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97caeab5-6fb4-47ff-96d6-b621c24047be", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.6852702521459227, 1.2804285139484979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 174.0, 141, 242, 148.0, 242.0, 242.0, 242.0, 0.05054261103128588, 0.03756145214336772, 0.025370021552813416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 251.45000000000002, 146, 444, 246.0, 419.30000000000007, 443.0, 444.0, 0.107048043161771, 0.028643714674145757, 0.061050837115697525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 283.2857142857143, 147, 657, 187.0, 657.0, 657.0, 657.0, 0.0491234964701259, 0.0386655646044155, 0.017461867885865064], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 1102.6923076923078, 152, 3406, 952.0, 2845.5999999999995, 3406.0, 3406.0, 0.08344994928810774, 0.016192249024277516, 0.05678884394538521], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/07a74746-5d16-432f-8682-c9257a6167c9", 3, 0, 0.0, 782.0, 296, 1568, 482.0, 1568.0, 1568.0, 1568.0, 0.017813457473339192, 0.02105490367372871, 0.011423343496900457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1930.7619047619048, 828, 3654, 1708.0, 3473.2000000000003, 3638.7999999999997, 3654.0, 0.09142956658031652, 0.04732194364020289, 0.04205402915950106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 363.28571428571433, 292, 503, 324.0, 503.0, 503.0, 503.0, 0.050448268903687046, 0.07818496362319467, 0.1134593391456946], "isController": false}, {"data": ["addBook", 54, 13, 24.074074074074073, 1906.6111111111109, 737, 4956, 1777.0, 2890.0, 3382.75, 4956.0, 0.27167214203422063, 85.34250970976359, 0.9863394741508987], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 352.0, 147, 819, 307.0, 603.2, 635.9, 819.0, 0.2518736069726218, 0.18718341299430194, 0.12175530805805448], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 1040.8867924528304, 709, 1548, 1015.0, 1371.0000000000002, 1511.5, 1548.0, 0.2510836866665087, 73.82694064298742, 0.12627744007153516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8570ba31-6973-4a16-b874-0e40dfd38de1", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 304.3962264150943, 141, 690, 264.0, 555.2, 624.7999999999998, 690.0, 0.25251923672487314, 0.4468406806108107, 0.1228072069228387], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1530.7547169811319, 1011, 2042, 1481.0, 1905.6000000000001, 2029.2, 2042.0, 0.2515030868444904, 226.30291963794232, 0.12624276038873836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 348.61111111111103, 157, 670, 314.0, 611.5000000000001, 670.0, 670.0, 0.10052103402637001, 0.07509628030290338, 0.03573208631406122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 13, 8.074534161490684, 330.2981366459626, 143, 3757, 259.0, 585.2, 692.2, 2080.5199999999877, 0.6561653047500662, 1.4530727818759805, 0.31341620519430236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 274.3636363636363, 152, 581, 257.0, 544.4000000000001, 581.0, 581.0, 0.06507374037943907, 0.0503940196493117, 0.023131681150503732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 233.99999999999997, 147, 401, 227.5, 371.0, 401.0, 401.0, 0.08406792688492301, 0.06822309300915139, 0.029883520884874976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b9412d5-6a2f-47d3-85d8-dd33334d7c8e", 3, 0, 0.0, 807.0, 262, 1216, 943.0, 1216.0, 1216.0, 1216.0, 0.028861972427195674, 0.024061038862645875, 0.01850849143280452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 607.2727272727273, 299, 1017, 532.0, 977.0000000000001, 1017.0, 1017.0, 0.06762364368487382, 0.10480343996864723, 0.1520871595764301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 627.9000000000001, 295, 983, 590.0, 921.5, 980.05, 983.0, 0.10696273952968482, 0.1657713551109471, 0.24056170814146893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ca47dff-f357-48b6-b694-efd8e8523417", 3, 0, 0.0, 1735.6666666666665, 883, 3406, 918.0, 3406.0, 3406.0, 3406.0, 0.028889488078271255, 0.023801853621778824, 0.018526136560610147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd7ef707-af76-4e08-8d7e-bd9b0f5607f2", 3, 0, 0.0, 1176.0, 540, 2005, 983.0, 2005.0, 2005.0, 2005.0, 0.03345637845855312, 0.027194198245770556, 0.021454773946402883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/554b20f8-c6c6-4fa4-b9eb-29ba409e969b", 3, 0, 0.0, 609.3333333333334, 267, 938, 623.0, 938.0, 938.0, 938.0, 0.03851733922220653, 0.032110320881533504, 0.02470024683194885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 322.625, 149, 688, 293.0, 688.0, 688.0, 688.0, 0.05623941117336502, 0.04662818367791689, 0.019991353190532097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=378a3d72-a328-4dff-9480-2ec998596ade", 1, 0, 0.0, 1092.0, 1092, 1092, 1092.0, 1092.0, 1092.0, 1092.0, 0.9157509157509157, 0.16544328067765565, 0.6313673305860805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 176.91666666666669, 149, 438, 151.0, 356.4000000000003, 438.0, 438.0, 0.06521632799465227, 0.0506318171442857, 0.02318236659184905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c554bb8-1ce6-4a34-97cf-3afe015d3ef8", 1, 0, 0.0, 860.0, 860, 860, 860.0, 860.0, 860.0, 860.0, 1.1627906976744187, 0.21007449127906977, 0.8016896802325582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 341.94444444444446, 151, 638, 288.0, 564.2000000000002, 638.0, 638.0, 0.09425021337201082, 0.0700433714610354, 0.04730918913399763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 330.88888888888897, 148, 733, 296.0, 682.6000000000001, 733.0, 733.0, 0.09414767586001287, 0.040903569243000384, 0.052815048198379615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 456.0555555555555, 149, 1547, 322.5, 1510.1000000000001, 1547.0, 1547.0, 0.09415063054769514, 9.435546129232202, 0.05445126527986275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 465.0, 150, 1470, 343.5, 1437.6000000000001, 1470.0, 1470.0, 0.09415260044251722, 3.09855635948509, 0.05454435045167095], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 23.333333333333332, 0.5686433793663688], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.2437043054427295], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.666666666666667, 0.16246953696181965], "isController": false}, {"data": ["401/Unauthorized", 18, 60.0, 1.4622258326563768], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1231, 30, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
