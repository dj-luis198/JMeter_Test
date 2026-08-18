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

    var data = {"OkPercent": 98.98989898989899, "KoPercent": 1.0101010101010102};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7896321070234114, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16964285714285715, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db44601a-afcf-4dde-a25f-e5f6ced2b329"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/afbd6b64-f424-40cc-a21f-33a61f1bb17c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d5a0494-c70a-4a27-b120-5049a9ccb86e"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bea4924-ceb0-4eb8-b7d6-a5b05f9a720b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a34e8ed-3d3f-4952-928e-e7eec8755eea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3eec8204-f4ca-4ce0-96ba-184ebdb161f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c098a716-9ef6-4d7b-ae3e-f5e7dca9f17e"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51b69246-fa40-4e93-9439-4c12d0f11324"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/324072da-e64f-458b-a651-f5f72337a974"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40c55ade-7461-4f3f-80d6-59ef0a249399"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffba94d0-5a3b-473b-9ffd-1abddc75fe5d"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9eabbf4-5db3-49ea-a20e-aac6727887c5"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61c907e5-0f92-41cb-9e31-06d10343002c"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afbd6b64-f424-40cc-a21f-33a61f1bb17c"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bf6c124-aa2c-48b9-a7b4-7be4f795a2c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/76e4ea9b-e244-4edc-a68f-7fb20a8ed175"], "isController": false}, {"data": [0.15789473684210525, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d5a0494-c70a-4a27-b120-5049a9ccb86e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51b69246-fa40-4e93-9439-4c12d0f11324"], "isController": false}, {"data": [0.3474576271186441, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5803571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7bea4924-ceb0-4eb8-b7d6-a5b05f9a720b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9683908045977011, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c098a716-9ef6-4d7b-ae3e-f5e7dca9f17e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a34e8ed-3d3f-4952-928e-e7eec8755eea"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3eec8204-f4ca-4ce0-96ba-184ebdb161f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=324072da-e64f-458b-a651-f5f72337a974"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7bf6c124-aa2c-48b9-a7b4-7be4f795a2c9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76e4ea9b-e244-4edc-a68f-7fb20a8ed175"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40c55ade-7461-4f3f-80d6-59ef0a249399"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e482f09-e949-4767-91e2-2e1ab211b144"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61c907e5-0f92-41cb-9e31-06d10343002c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1287, 13, 1.0101010101010102, 364.2432012432013, 97, 2478, 118.0, 1004.4000000000001, 1245.6, 1724.159999999998, 4.972164378904424, 696.5204915252027, 3.632595486949517], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1658.25, 1234, 2351, 1662.5, 1952.6, 2100.6499999999996, 2351.0, 0.24189228881939287, 291.07926177227137, 1.1893824943414482], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/db44601a-afcf-4dde-a25f-e5f6ced2b329", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 563.6153846153845, 137, 845, 578.0, 829.4, 845.0, 845.0, 0.07431289157177483, 0.014078809536058902, 0.05023600595360589], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 563.6153846153845, 137, 845, 578.0, 829.4, 845.0, 845.0, 0.07372540123631827, 0.013967507656099358, 0.0498388586031872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 140.29411764705878, 97, 320, 102.0, 316.0, 320.0, 320.0, 0.09656128233382939, 0.03436889391891124, 0.05459306874595295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 129.1764705882353, 99, 313, 104.0, 301.8, 313.0, 313.0, 0.09655854003487467, 0.07175883688138636, 0.048467860915942955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 157.1764705882353, 99, 815, 103.0, 406.99999999999966, 815.0, 815.0, 0.09656073386157735, 1.6946164728351936, 0.05637331906222487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 206.00000000000003, 100, 1021, 105.0, 452.9999999999995, 1021.0, 1021.0, 0.0965618308123122, 5.135466352817049, 0.056279660812369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afbd6b64-f424-40cc-a21f-33a61f1bb17c", 3, 0, 0.0, 398.33333333333337, 196, 731, 268.0, 731.0, 731.0, 731.0, 0.024765143885485976, 0.024837698017962984, 0.015881293442189897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d5a0494-c70a-4a27-b120-5049a9ccb86e", 3, 0, 0.0, 327.6666666666667, 208, 441, 334.0, 441.0, 441.0, 441.0, 0.03254890472935586, 0.0271346826210548, 0.02087283278542677], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 385.7692307692307, 103, 1954, 211.0, 1407.9999999999995, 1954.0, 1954.0, 0.07453829261440194, 0.1654994226865894, 0.048182242183513274], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 116.05882352941177, 100, 298, 105.0, 153.9999999999999, 298.0, 298.0, 0.08389220345339787, 0.0623456707305037, 0.04210995368656886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bea4924-ceb0-4eb8-b7d6-a5b05f9a720b", 1, 0, 0.0, 763.0, 763, 763, 763.0, 763.0, 763.0, 763.0, 1.3106159895150722, 0.2367812090432503, 0.9036082896461337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 125.88235294117648, 98, 303, 104.0, 301.4, 303.0, 303.0, 0.08389137547312268, 0.029859315397028272, 0.04742985508998584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 804.0, 789, 814, 809.0, 814.0, 814.0, 814.0, 0.03547986517651233, 10.432258404293062, 0.020234610608479687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 900.3333333333334, 883, 915, 903.0, 915.0, 915.0, 915.0, 0.03545093590470789, 31.898814443154425, 0.020183491828559275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a34e8ed-3d3f-4952-928e-e7eec8755eea", 3, 0, 0.0, 471.33333333333337, 247, 868, 299.0, 868.0, 868.0, 868.0, 0.025333344592597597, 0.02540756337558372, 0.016245666942518642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 236.66666666666666, 104, 304, 302.0, 304.0, 304.0, 304.0, 0.03569601275537523, 0.06316521007103507, 0.019765272687790773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 116.47058823529412, 102, 310, 104.0, 149.19999999999987, 310.0, 310.0, 0.08301673031282658, 0.0616950505547471, 0.041670507207805525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 137.41176470588235, 100, 297, 104.0, 297.0, 297.0, 297.0, 0.08302078449757774, 0.02221454585189092, 0.047347791158774806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 138.64705882352942, 99, 305, 104.0, 302.6, 305.0, 305.0, 0.08301956820057528, 0.022376367991561306, 0.04880642583666633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 174.52941176470588, 100, 313, 105.0, 308.2, 313.0, 313.0, 0.08293815740686533, 0.02235442523856917, 0.04883955948861308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3eec8204-f4ca-4ce0-96ba-184ebdb161f3", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 168.33333333333331, 102, 298, 105.0, 298.0, 298.0, 298.0, 0.035780735651925, 0.026590956866323172, 0.020091721679547734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 623.1, 99, 1339, 506.5, 1283.2, 1336.45, 1339.0, 0.09108588032226185, 40.99189285852541, 0.049634688691232526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 175.88235294117646, 99, 1143, 103.0, 473.3999999999994, 1143.0, 1143.0, 0.08389178946121732, 4.461633115605354, 0.04889511120596915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 428.9, 100, 909, 309.5, 897.4000000000002, 908.85, 909.0, 0.09108505066605943, 13.403289735853354, 0.049723186838210184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 178.58823529411762, 100, 821, 103.0, 402.5999999999996, 821.0, 821.0, 0.08389178946121732, 1.4722797007777262, 0.04897703678161487], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 587.7692307692307, 106, 1650, 465.0, 1439.9999999999998, 1650.0, 1650.0, 0.07364854912358226, 0.01395294778317867, 0.05037335034331554], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c098a716-9ef6-4d7b-ae3e-f5e7dca9f17e", 3, 0, 0.0, 350.0, 203, 553, 294.0, 553.0, 553.0, 553.0, 0.03187691261475689, 0.026574470444789187, 0.02044190034214553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 315.8235294117647, 206, 618, 224.0, 457.9999999999999, 618.0, 618.0, 0.0828932676038482, 0.12846837469463585, 0.18642890165201406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51b69246-fa40-4e93-9439-4c12d0f11324", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 672.7894736842105, 173, 1567, 658.0, 1200.0, 1567.0, 1567.0, 0.07935215232272103, 0.04874267950292142, 0.03587895168498031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 104.45, 100, 126, 103.0, 106.80000000000001, 125.04999999999998, 126.0, 0.0910854654922714, 0.06769144456993997, 0.04572063404592529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 153.29999999999998, 99, 309, 104.0, 305.5, 308.85, 309.0, 0.0910854654922714, 0.09277552784027253, 0.04812230159308479], "isController": false}, {"data": ["login", 19, 0, 0.0, 2800.9999999999995, 2085, 4415, 2636.0, 3405.0, 4415.0, 4415.0, 0.0806065002778803, 15.339235538822637, 0.1427227245103155], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 119.76470588235293, 101, 312, 109.0, 154.39999999999986, 312.0, 312.0, 0.0848756571622573, 0.0687128122924915, 0.030170643756896147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/324072da-e64f-458b-a651-f5f72337a974", 3, 0, 0.0, 372.0, 237, 472, 407.0, 472.0, 472.0, 472.0, 0.02324464210999365, 0.02747438004602439, 0.014906232082255038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40c55ade-7461-4f3f-80d6-59ef0a249399", 3, 0, 0.0, 317.3333333333333, 209, 417, 326.0, 417.0, 417.0, 417.0, 0.06577649148194435, 0.04228794618386722, 0.04218088809226249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 729.25, 206, 1444, 611.0, 1386.4, 1441.35, 1444.0, 0.09104234379409863, 54.52969623437486, 0.1931093464070139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffba94d0-5a3b-473b-9ffd-1abddc75fe5d", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 349.58823529411757, 205, 1127, 216.0, 726.1999999999996, 1127.0, 1127.0, 0.09650153550972679, 6.931901314407678, 0.2155818137889341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 682.8, 103, 1181, 1006.0, 1181.0, 1181.0, 1181.0, 0.05901306549270008, 42.366401796357714, 0.09548129580889209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9eabbf4-5db3-49ea-a20e-aac6727887c5", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1278.5, 188, 2478, 1257.5, 2035.7999999999997, 2423.5499999999993, 2478.0, 0.08485199112911002, 0.026832634268633693, 0.03828283193520394], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61c907e5-0f92-41cb-9e31-06d10343002c", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 339.1176470588235, 202, 1246, 212.0, 733.1999999999996, 1246.0, 1246.0, 0.08384917013983081, 6.023056209770894, 0.18731677260844903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 124.35714285714285, 102, 316, 107.0, 222.0, 316.0, 316.0, 0.08618301578995968, 0.0669096655791191, 0.03063536889408723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afbd6b64-f424-40cc-a21f-33a61f1bb17c", 1, 0, 0.0, 1650.0, 1650, 1650, 1650.0, 1650.0, 1650.0, 1650.0, 0.6060606060606061, 0.10949337121212122, 0.4178503787878788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 11, 0, 0.0, 514.8181818181819, 205, 1456, 406.0, 1388.0000000000002, 1456.0, 1456.0, 0.08995600333654993, 19.681094148668652, 0.19812841679478582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 139.5, 101, 312, 104.5, 309.90000000000003, 312.0, 312.0, 0.05525548756060836, 0.041063892610959926, 0.027735664654445994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 119.0, 99, 308, 101.5, 248.00000000000023, 308.0, 308.0, 0.055256759743608636, 0.01478550016577028, 0.0315136207912768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 137.08333333333331, 100, 309, 104.0, 308.1, 309.0, 309.0, 0.05525701418723839, 0.014893492105154098, 0.03248508060616945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 119.41666666666667, 99, 308, 103.0, 248.00000000000023, 308.0, 308.0, 0.05525625086337892, 0.0148932863655201, 0.03253859303771239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 2.7822818396226414, 5.831736438679245], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1139.0892857142858, 791, 1899, 1070.5, 1524.4, 1638.4999999999998, 1899.0, 0.23994584079593462, 287.058644263152, 0.47379930672791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1278.5, 188, 2478, 1257.5, 2035.7999999999997, 2423.5499999999993, 2478.0, 0.08499426288725512, 0.02687762468078859, 0.0383470209510858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 130.57142857142856, 99, 300, 103.0, 300.0, 300.0, 300.0, 0.04103477990702691, 0.011060155521815848, 0.02416403543353245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 133.00000000000003, 100, 304, 102.0, 304.0, 304.0, 304.0, 0.04103502045888877, 0.011060220358059864, 0.024124103824463904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 259.7142857142857, 99, 1110, 104.0, 1004.0, 1110.0, 1110.0, 0.08883699680186811, 11.43990742312427, 0.05113580479973602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 252.57142857142858, 102, 905, 105.5, 745.5, 905.0, 905.0, 0.08883699680186811, 3.7520989723463116, 0.05122255967942535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bf6c124-aa2c-48b9-a7b4-7be4f795a2c9", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 187.57142857142858, 100, 310, 102.0, 310.0, 310.0, 310.0, 0.04098480634679001, 0.010966637635762172, 0.02337414736965368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 117.28571428571428, 99, 301, 103.0, 204.5, 301.0, 301.0, 0.08883417831557708, 0.06601836884585366, 0.04459059341231115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 132.0, 102, 304, 104.0, 304.0, 304.0, 304.0, 0.041034539357985324, 0.030495394972096513, 0.020597415263676228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 145.21428571428572, 98, 310, 102.0, 309.0, 310.0, 310.0, 0.08883981546701188, 0.0428334824573093, 0.04960057777608559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 106.85714285714285, 104, 111, 107.0, 111.0, 111.0, 111.0, 0.041363091122889745, 0.03255727680180579, 0.014703286297589713], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 548.3846153846154, 104, 967, 475.0, 927.4, 967.0, 967.0, 0.07373501902930683, 0.013814238090376447, 0.05018323861219351], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/76e4ea9b-e244-4edc-a68f-7fb20a8ed175", 3, 0, 0.0, 589.0, 211, 967, 589.0, 967.0, 967.0, 967.0, 0.03285007227015899, 0.02689385799461259, 0.02106596431387149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1653.3157894736844, 1339, 2441, 1653.0, 2180.0, 2441.0, 2441.0, 0.08030329285765607, 0.04156322774859152, 0.03693637786714454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 322.0, 203, 606, 210.0, 606.0, 606.0, 606.0, 0.04096010485786843, 0.06348016250921602, 0.09212023582780372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d5a0494-c70a-4a27-b120-5049a9ccb86e", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51b69246-fa40-4e93-9439-4c12d0f11324", 3, 0, 0.0, 379.3333333333333, 193, 494, 451.0, 494.0, 494.0, 494.0, 0.025227679810287847, 0.02530158902848205, 0.016177906649175476], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 1094.8305084745766, 522, 2924, 880.0, 1829.0, 1993.0, 2924.0, 0.2691151584814607, 88.31783907797269, 0.9785224223671187], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 189.39285714285717, 102, 427, 106.0, 417.0, 419.9, 427.0, 0.2406883687345809, 0.17887094590528912, 0.11634838137072026], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 640.0535714285714, 479, 983, 601.5, 828.0000000000001, 925.75, 983.0, 0.2406769899904159, 70.76702628536555, 0.1210436033643205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bea4924-ceb0-4eb8-b7d6-a5b05f9a720b", 3, 0, 0.0, 987.3333333333334, 326, 1954, 682.0, 1954.0, 1954.0, 1954.0, 0.016467591779378184, 0.022701904682834183, 0.010560272072062182], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 152.91071428571433, 100, 327, 106.5, 308.0, 315.6, 327.0, 0.24106654728132895, 0.4265747887439142, 0.11723744193955257], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 948.0357142857142, 688, 1431, 914.5, 1188.5, 1238.1999999999998, 1431.0, 0.24042796177195408, 216.3375026296808, 0.12068356674881288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 11, 0, 0.0, 107.63636363636364, 102, 123, 106.0, 120.60000000000001, 123.0, 123.0, 0.09393921278939683, 0.07017919705457869, 0.0333924545462309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, 2.2988505747126435, 179.02298850574712, 100, 1444, 110.0, 317.0, 393.0, 1138.0, 0.7195256093224054, 1.5225145093993202, 0.3468564432691274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 132.66666666666669, 104, 327, 110.5, 270.6000000000002, 327.0, 327.0, 0.055381974090466454, 0.04288857954466787, 0.0196865611024705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c098a716-9ef6-4d7b-ae3e-f5e7dca9f17e", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 125.47058823529412, 103, 348, 109.0, 179.99999999999986, 348.0, 348.0, 0.09190778945547337, 0.07458532523193201, 0.032670347033000306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a34e8ed-3d3f-4952-928e-e7eec8755eea", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3eec8204-f4ca-4ce0-96ba-184ebdb161f3", 3, 0, 0.0, 524.6666666666666, 208, 913, 453.0, 913.0, 913.0, 913.0, 0.08834702712253734, 0.039974729069116824, 0.056654831846158375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=324072da-e64f-458b-a651-f5f72337a974", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 278.50000000000006, 204, 620, 212.5, 618.5, 620.0, 620.0, 0.055229293617334634, 0.08559461813545904, 0.12421197578195474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 423.2857142857142, 204, 1210, 311.5, 1109.0, 1210.0, 1210.0, 0.0887755943208984, 15.290283313041769, 0.19641352543737833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bf6c124-aa2c-48b9-a7b4-7be4f795a2c9", 3, 0, 0.0, 533.3333333333334, 197, 931, 472.0, 931.0, 931.0, 931.0, 0.018335951299713348, 0.025277589112723316, 0.011758406269672948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76e4ea9b-e244-4edc-a68f-7fb20a8ed175", 1, 0, 0.0, 1125.0, 1125, 1125, 1125.0, 1125.0, 1125.0, 1125.0, 0.888888888888889, 0.1605902777777778, 0.6128472222222222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40c55ade-7461-4f3f-80d6-59ef0a249399", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 108.58823529411767, 101, 137, 106.0, 124.99999999999999, 137.0, 137.0, 0.08327047229052577, 0.06903967868618788, 0.029600050697022835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e482f09-e949-4767-91e2-2e1ab211b144", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 119.55, 105, 315, 107.0, 125.0, 305.4999999999999, 315.0, 0.09282594670862399, 0.0720670191731993, 0.032996723244081184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61c907e5-0f92-41cb-9e31-06d10343002c", 3, 0, 0.0, 370.6666666666667, 211, 475, 426.0, 475.0, 475.0, 475.0, 0.023963575365444526, 0.024033781152647975, 0.01536726675453311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 11, 0, 0.0, 103.09090909090911, 100, 109, 102.0, 108.2, 109.0, 109.0, 0.09096321778248215, 0.06760059446530167, 0.04565927142597248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 11, 0, 0.0, 158.0909090909091, 98, 326, 104.0, 321.6, 326.0, 326.0, 0.0909647222268164, 0.04918103323520169, 0.05048929717347799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 11, 0, 0.0, 355.0909090909091, 101, 1354, 106.0, 1285.6000000000004, 1354.0, 1354.0, 0.09003331232556046, 14.749333318668816, 0.05152296974880705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 11, 0, 0.0, 347.1818181818182, 103, 837, 303.0, 835.0, 837.0, 837.0, 0.09042185907342255, 4.853945578371091, 0.05183362429306546], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 38.46153846153846, 0.3885003885003885], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.0777000777000777], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.0777000777000777], "isController": false}, {"data": ["401/Unauthorized", 6, 46.15384615384615, 0.4662004662004662], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1287, 13, "401/Unauthorized", 6, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
